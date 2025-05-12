import supabase from '../supabase/supabaseClient'
import { useEffect, useState } from 'react'
import { PostgrestError } from '@supabase/supabase-js'

const useSupabaseRead = <T,>(table: string): { data: T[] | null; error: PostgrestError | null } => {
   const [error, setError] = useState<PostgrestError | null>(null)
    const [data, setData] = useState<T[] | null>(null)

  useEffect(() => {
  const fetchData = async () => {
    const { data, error } = await supabase
      .from(table)
      .select()

    if (error) {
      setError(error)
      setData(null)
      console.error('Error fetching data:', error)
    }

    if (data) {
      setData(data)
      setError(null)
    }
  }
  fetchData()
  },[table])
  
  return { data, error }
}

  export default useSupabaseRead