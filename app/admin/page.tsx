'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabase'
import { BackButton } from '@/components/back-button'
import { DataTable } from '@/components/data-table'
import { columns } from './columns'

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setIsLoading(true)
    try {
      const [usersData, groupsData, resourcesData] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('groups').select('*'),
        supabase.from('resources').select('*')
      ])

      if (usersData.error) throw usersData.error
      if (groupsData.error) throw groupsData.error
      if (resourcesData.error) throw resourcesData.error

      setUsers(usersData.data || [])
      setGroups(groupsData.data || [])
      setResources(resourcesData.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading users...</p>
              ) : (
                <DataTable columns={columns.users} data={users} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>Groups</CardTitle>
              <CardDescription>Manage study groups</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading groups...</p>
              ) : (
                <DataTable columns={columns.groups} data={groups} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>Manage shared resources</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading resources...</p>
              ) : (
                <DataTable columns={columns.resources} data={resources} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

