import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export const App = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>shadcn/ui Test</CardTitle>
          <CardDescription>Testing component installation and theme configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Type something..." />
          <Button className="w-full">Click me</Button>
          <div className="flex gap-2">
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
