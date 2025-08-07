CREATE OR REPLACE FUNCTION delete_inscription(p_alumno_id integer)
RETURNS void AS $$
DECLARE
    v_clase_id integer;
    v_current_capacity integer;
    v_blocked boolean;
BEGIN
    -- Verificar si las eliminaciones están bloqueadas
    SELECT alumno_class_1 IS NOT NULL INTO v_blocked 
    FROM alumno 
    WHERE alumno_id = 1;
    
    IF v_blocked THEN
        RAISE EXCEPTION 'Eliminar clases bloqueado';
    END IF;
    
    -- Verificar que el alumno existe
    IF NOT EXISTS (SELECT 1 FROM alumno WHERE alumno_id = p_alumno_id) THEN
        RAISE EXCEPTION 'Alumno no encontrado';
    END IF;
    
    -- Incrementar capacidades para todas las clases del alumno
    FOR v_clase_id IN 
        SELECT clase_id FROM alumno_clase WHERE alumno_id = p_alumno_id
    LOOP
        -- Bloquea la fila y obtiene la capacidad actual
        SELECT capacidad_clase INTO v_current_capacity 
        FROM clase 
        WHERE clase_id = v_clase_id 
        FOR UPDATE;
        
        -- Incrementa la capacidad
        UPDATE clase 
        SET capacidad_clase = v_current_capacity + 1 
        WHERE clase_id = v_clase_id;
    END LOOP;
    
    -- Eliminar todas las relaciones alumno-clase
    DELETE FROM alumno_clase WHERE alumno_id = p_alumno_id;
    
    -- Si no había clases, no es un error
EXCEPTION
    WHEN others THEN
        RAISE EXCEPTION 'Error al eliminar inscripción: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;








CREATE OR REPLACE FUNCTION delete_inscription(p_alumno_id integer) -- Clase 2
RETURNS void AS $$
DECLARE
    v_blocked boolean;
BEGIN
    -- Verificar si las eliminaciones están bloqueadas
    SELECT alumno_class_1 IS NOT NULL INTO v_blocked 
    FROM alumno 
    WHERE alumno_id = 1;
    
    IF v_blocked THEN
        RAISE EXCEPTION 'Eliminar clases bloqueado';
    END IF;
    
    -- Verificar que el alumno existe
    IF NOT EXISTS (SELECT 1 FROM alumno WHERE alumno_id = p_alumno_id) THEN
        RAISE EXCEPTION 'Alumno no encontrado';
    END IF;
    
    -- Incrementar capacidades ATÓMICAMENTE
    UPDATE clase
    SET capacidad_clase = capacidad_clase + 1
    WHERE clase_id IN (
        SELECT clase_id
        FROM alumno_clase
        WHERE alumno_id = p_alumno_id
    );
    
    -- Eliminar todas las relaciones alumno-clase
    DELETE FROM alumno_clase WHERE alumno_id = p_alumno_id;
    
EXCEPTION
    WHEN others THEN
        RAISE EXCEPTION 'Error al eliminar inscripción: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;







CREATE OR REPLACE FUNCTION delete_inscription(p_alumno_id integer) -- clase 3
RETURNS json AS $$
DECLARE
    v_blocked boolean;
    clase_ids int[];
BEGIN
    -- 1. Verificación de bloqueo CON BLOQUEO
    SELECT alumno_class_1 IS NOT NULL INTO v_blocked 
    FROM alumno 
    WHERE alumno_id = 1
    FOR UPDATE;  -- ¡Importante!
    
    IF v_blocked THEN
        RETURN json_build_object('error', 'Eliminar clases bloqueado');
    END IF;
    
    -- 2. Verificar alumno y obtener clases CON BLOQUEO
    SELECT array_agg(clase_id) INTO clase_ids
    FROM alumno_clase
    WHERE alumno_id = p_alumno_id
    FOR UPDATE;  -- Bloquea las relaciones
    
    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Alumno no inscrito en clases');
    END IF;
    
    -- 3. Incrementar capacidades ATÓMICAMENTE
    UPDATE clase
    SET capacidad_clase = capacidad_clase + 1
    WHERE clase_id = ANY(clase_ids)
    RETURNING clase_id;
    
    -- 4. Eliminar relaciones
    DELETE FROM alumno_clase 
    WHERE alumno_id = p_alumno_id;
    
    RETURN json_build_object('success', true);
    
EXCEPTION
    WHEN others THEN
        RETURN json_build_object('error', 'Error eliminando inscripción: ' || SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;