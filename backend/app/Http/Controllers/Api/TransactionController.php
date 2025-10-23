<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Post;
use App\Models\Review;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $user = Auth::user();
            
            // Obtener transacciones donde el usuario es comprador o vendedor
            $transactions = Transaction::with([
                'buyer:id,name,email',
                'seller:id,name,email',
                'post:id,title,description',
                'post.images:id,post_id,image_url',
                'post.product:id,name,image_url',
                'review:id,rating,comment,transaction_id'
            ])
            ->where('buyer_id', $user->id)
            ->orWhere('seller_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

            return $this->successResponse($transactions, 'Transacciones obtenidas exitosamente');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener las transacciones', 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'post_id' => 'required|exists:posts,id',
                'quantity_kg' => 'required|numeric|min:0.01',
                'notes' => 'nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse($validator->errors(), 422);
            }

            $user = Auth::user();
            $post = Post::findOrFail($request->post_id);

            // Verificar que el usuario no esté comprando su propia publicación
            if ($post->user_id === $user->id) {
                return $this->errorResponse('No puedes comprar tu propia publicación', 400);
            }

            // Verificar que la publicación esté activa
            if ($post->status !== 'ACTIVE') {
                return $this->errorResponse('Esta publicación no está disponible para compra', 400);
            }

            DB::beginTransaction();

            // Crear la transacción
            $transaction = Transaction::create([
                'buyer_id' => $user->id,
                'seller_id' => $post->user_id,
                'post_id' => $post->id,
                'quantity_kg' => $request->quantity_kg,
                'price_per_kg' => $post->price_per_kg,
                'total_amount' => $request->quantity_kg * $post->price_per_kg,
                'status' => 'PENDING',
                'notes' => $request->notes,
            ]);

            // Cargar las relaciones
            $transaction->load([
                'buyer:id,name,email',
                'seller:id,name,email',
                'post:id,title,description',
                'post.images:id,post_id,image_url',
                'post.product:id,name,image_url'
            ]);

            DB::commit();

            return $this->successResponse($transaction, 'Transacción creada exitosamente', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Error al crear la transacción', 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $user = Auth::user();
            
            $transaction = Transaction::with([
                'buyer:id,name,email',
                'seller:id,name,email',
                'post:id,title,description',
                'post.images:id,post_id,image_url',
                'post.product:id,name,image_url',
                'review:id,rating,comment,transaction_id'
            ])
            ->where(function($query) use ($user) {
                $query->where('buyer_id', $user->id)
                      ->orWhere('seller_id', $user->id);
            })
            ->findOrFail($id);

            return $this->successResponse($transaction, 'Transacción obtenida exitosamente');
        } catch (\Exception $e) {
            return $this->errorResponse('Transacción no encontrada', 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:PENDING,CONFIRMED,COMPLETED,CANCELLED',
                'notes' => 'nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse($validator->errors(), 422);
            }

            $user = Auth::user();
            $transaction = Transaction::findOrFail($id);

            // Verificar que el usuario tenga permisos para actualizar esta transacción
            if ($transaction->buyer_id !== $user->id && $transaction->seller_id !== $user->id) {
                return $this->errorResponse('No tienes permisos para actualizar esta transacción', 403);
            }

            DB::beginTransaction();

            $updateData = [
                'status' => $request->status,
            ];

            if ($request->has('notes')) {
                $updateData['notes'] = $request->notes;
            }

            // Si se marca como completada, agregar timestamp
            if ($request->status === 'COMPLETED') {
                $updateData['completed_at'] = now();
            }

            $transaction->update($updateData);

            // Cargar las relaciones actualizadas
            $transaction->load([
                'buyer:id,name,email',
                'seller:id,name,email',
                'post:id,title,description',
                'post.images:id,post_id,image_url',
                'post.product:id,name,image_url',
                'review:id,rating,comment,transaction_id'
            ]);

            DB::commit();

            return $this->successResponse($transaction, 'Transacción actualizada exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Error al actualizar la transacción', 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $user = Auth::user();
            $transaction = Transaction::findOrFail($id);

            // Solo el comprador puede cancelar una transacción pendiente
            if ($transaction->buyer_id !== $user->id) {
                return $this->errorResponse('No tienes permisos para cancelar esta transacción', 403);
            }

            if ($transaction->status !== 'PENDING') {
                return $this->errorResponse('Solo se pueden cancelar transacciones pendientes', 400);
            }

            $transaction->delete();

            return $this->successResponse(null, 'Transacción cancelada exitosamente');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al cancelar la transacción', 500);
        }
    }

    /**
     * Obtener historial de compras del usuario
     */
    public function purchaseHistory()
    {
        try {
            $user = Auth::user();
            
            $purchases = Transaction::with([
                'seller:id,name,email',
                'post:id,title,description',
                'post.images:id,post_id,image_url',
                'post.product:id,name,image_url',
                'review:id,rating,comment,transaction_id'
            ])
            ->where('buyer_id', $user->id)
            ->where('status', 'COMPLETED')
            ->orderBy('completed_at', 'desc')
            ->get();

            return $this->successResponse($purchases, 'Historial de compras obtenido exitosamente');
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener el historial de compras', 500);
        }
    }

    /**
     * Crear una reseña para una transacción completada
     */
    public function createReview(Request $request, string $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse($validator->errors(), 422);
            }

            $user = Auth::user();
            $transaction = Transaction::findOrFail($id);

            // Verificar que el usuario sea el comprador y la transacción esté completada
            if ($transaction->buyer_id !== $user->id) {
                return $this->errorResponse('Solo el comprador puede crear reseñas', 403);
            }

            if ($transaction->status !== 'COMPLETED') {
                return $this->errorResponse('Solo se pueden crear reseñas para transacciones completadas', 400);
            }

            // Verificar que no exista ya una reseña para esta transacción
            if ($transaction->review) {
                return $this->errorResponse('Ya existe una reseña para esta transacción', 400);
            }

            DB::beginTransaction();

            $review = Review::create([
                'rating' => $request->rating,
                'comment' => $request->comment,
                'reviewer_id' => $user->id,
                'reviewed_id' => $transaction->seller_id,
                'transaction_id' => $transaction->id,
            ]);

            DB::commit();

            return $this->successResponse($review, 'Reseña creada exitosamente', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Error al crear la reseña', 500);
        }
    }
}
