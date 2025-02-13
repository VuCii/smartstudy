"use client"

import { useState, useEffect } from "react"
import { supabase, TABLES } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StudyGroup {
  id: string
  name: string
  description: string
  university: string
}

export function SupabaseTest() {
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStudyGroups()
  }, [])

  async function fetchStudyGroups() {
    try {
      setLoading(true)
      const { data, error } = await supabase.from(TABLES.STUDY_GROUPS).select("*")

      if (error) {
        throw error
      }

      setStudyGroups(data || [])
    } catch (err) {
      setError("Failed to fetch study groups")
      console.error("Error fetching study groups:", err)
    } finally {
      setLoading(false)
    }
  }

  async function createStudyGroup() {
    try {
      const newGroup = {
        name: `Study Group ${Math.floor(Math.random() * 1000)}`,
        description: "A new study group",
        university: "Sample University",
        creator_id: (await supabase.auth.getUser()).data.user?.id,
      }

      const { data, error } = await supabase.from(TABLES.STUDY_GROUPS).insert([newGroup]).select()

      if (error) {
        throw error
      }

      setStudyGroups([...studyGroups, data[0]])
    } catch (err) {
      setError("Failed to create study group")
      console.error("Error creating study group:", err)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Test: Study Groups</CardTitle>
        <CardDescription>Fetching and creating study groups from Supabase</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={createStudyGroup} className="mb-4">
          Create New Study Group
        </Button>
        {studyGroups.length === 0 ? (
          <p>No study groups found</p>
        ) : (
          <ul className="space-y-2">
            {studyGroups.map((group) => (
              <li key={group.id} className="border p-2 rounded">
                <h3 className="font-bold">{group.name}</h3>
                <p>{group.description}</p>
                <p className="text-sm text-gray-500">{group.university}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

