-- Cleanup duplicate entries keeping the row with the smallest id
-- products_type: keep lowest id for each type_name

DELETE t1 FROM products_type t1
INNER JOIN products_type t2
  ON
    t1.type_name = t2.type_name
    AND t1.id > t2.id;

-- Add more cleanup statements for other tables here if needed.
