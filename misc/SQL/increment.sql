CREATE OR REPLACE FUNCTION increment() 
RETURNS integer AS $$
BEGIN
  RETURN 1; -- Retorna +1 para sumar 1 a capacidad_clase
END;
$$ LANGUAGE plpgsql;
