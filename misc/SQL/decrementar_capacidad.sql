CREATE OR REPLACE FUNCTION decrementar_capacidad(p_clase_id int)
RETURNS json AS $$
DECLARE
  capacidad_actual int;
BEGIN
  SELECT capacidad_clase INTO capacidad_actual
  FROM clase WHERE clase_id = p_clase_id FOR UPDATE;
  
  IF capacidad_actual > 0 THEN
    UPDATE clase SET capacidad_clase = capacidad_clase - 1
    WHERE clase_id = p_clase_id;
    RETURN json_build_object('success', true);
  ELSE
    RETURN json_build_object('error', 'No hay cupo');
  END IF;
END;
$$ LANGUAGE plpgsql;



