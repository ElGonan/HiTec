CREATE OR REPLACE FUNCTION decrement() 
RETURNS integer AS $$
BEGIN
  RETURN -1; -- Retorna -1 para restar 1 a capacidad_clase
END;
$$ LANGUAGE plpgsql;

