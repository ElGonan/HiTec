import supabase from '../supabase/supabaseClient'
import { useEffect, useState } from 'react'
import { PostgrestError } from '@supabase/supabase-js'

const useSupabaseRead = (table: string) => {
  const [error, setError] = useState<PostgrestError | null>(null)
  const [data, setData] = useState<Student[] | null>(null)

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