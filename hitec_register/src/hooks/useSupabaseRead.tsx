import supabase from '../supabase/supabaseClient'
import { useState } from 'react'
import { PostgrestError } from '@supabase/supabase-js'

const useSupabaseRead = (table: string) => {
  const [error, setError] = useState<PostgrestError | null>(null)
  const [data, setData] = useState<any[] | null>(null)

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

  return { data, error, fetchData }
}

  export default useSupabaseRead