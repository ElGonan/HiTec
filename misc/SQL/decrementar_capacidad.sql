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




CREATE OR REPLACE FUNCTION decrementar_capacidad(p_clase_id int) -- Clase 2
RETURNS json AS $$
BEGIN
    -- Actualización atómica: decrementa solo si hay cupo disponible
    UPDATE clase
    SET capacidad_clase = capacidad_clase - 1
    WHERE clase_id = p_clase_id
      AND capacidad_clase > 0;
    
    -- Mantener el formato JSON que espera el frontend
    IF FOUND THEN
        RETURN json_build_object('success', true);
    ELSE
        RETURN json_build_object('error', 'No hay cupo');
    END IF;
    
EXCEPTION
    WHEN others THEN
        RAISE EXCEPTION 'Error en decrementar_capacidad: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;







-- clase 3
CREATE OR REPLACE FUNCTION decrementar_capacidad(
  p_clase_id   int,
  p_alumno_id  int
) RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  v_new_capacity int;
  v_alumno_exists boolean;
BEGIN
  -- Verificar si el alumno existe primero
  SELECT EXISTS(SELECT 1 FROM alumno WHERE alumno_id = p_alumno_id) INTO v_alumno_exists;
  IF NOT v_alumno_exists THEN
    RETURN json_build_object('error', 'El alumno no existe');
  END IF;

  -- Bloquear la fila
  PERFORM 1 FROM clase WHERE clase_id = p_clase_id FOR UPDATE;

  -- Decrementar capacidad
  UPDATE clase
  SET capacidad_clase = capacidad_clase - 1
  WHERE clase_id = p_clase_id
  AND capacidad_clase > 0
  RETURNING capacidad_clase INTO v_new_capacity;

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'No hay cupo disponible');
  END IF;

  -- Insertar relación
  BEGIN
    INSERT INTO alumno_clase(alumno_id, clase_id)
    VALUES (p_alumno_id, p_clase_id)
    ON CONFLICT DO NOTHING;
    
    RETURN json_build_object(
      'success', true,
      'remaining_capacity', v_new_capacity
    );
  EXCEPTION WHEN others THEN
    RETURN json_build_object('error', 'Error al insertar en alumno_clase: ' || SQLERRM);
  END;

EXCEPTION
  WHEN others THEN
    RETURN json_build_object('error', 'Error general: ' || SQLERRM);
END;
$$ SECURITY DEFINER;



-- clase 4

CREATE OR REPLACE FUNCTION decrementar_capacidad(
  p_clase_id   int,
  p_alumno_id  int
) RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  v_new_capacity int;
  v_alumno_exists boolean;
BEGIN
  -- Verificar si el alumno existe primero
  SELECT EXISTS(SELECT 1 FROM alumno WHERE alumno_id = p_alumno_id) INTO v_alumno_exists;
  IF NOT v_alumno_exists THEN
    RETURN json_build_object('error', 'El alumno no existe');
  END IF;

  -- Bloquear la fila
  PERFORM 1 FROM clase WHERE clase_id = p_clase_id FOR UPDATE;

  -- Decrementar capacidad
  UPDATE clase
  SET capacidad_clase = capacidad_clase - 1
  WHERE clase_id = p_clase_id
  AND capacidad_clase > 0
  RETURNING capacidad_clase INTO v_new_capacity;

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'No hay cupo disponible');
  END IF;

  -- Insertar relación
  BEGIN
    INSERT INTO alumno_clase(alumno_id, clase_id)
    VALUES (p_alumno_id, p_clase_id)
    ON CONFLICT DO NOTHING;
    
    RETURN json_build_object(
      'success', true,
      'remaining_capacity', v_new_capacity
    );
  EXCEPTION WHEN others THEN
    RETURN json_build_object('error', 'Error al insertar en alumno_clase: ' || SQLERRM);
  END;

EXCEPTION
  WHEN others THEN
    RETURN json_build_object('error', 'Error general: ' || SQLERRM);
END;
$$ SECURITY DEFINER;