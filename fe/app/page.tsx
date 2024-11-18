import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="h-6 w-6 text-blue-500" />
          <span className="text-xl font-bold">TaskFlow</span>
        </div>
        <div className="space-x-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Manage your tasks with ease and efficiency
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Streamline your workflow, collaborate with your team, and achieve more together.
            Everything you need in one powerful platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border bg-white dark:bg-gray-800 shadow-sm"
              >
                <feature.icon className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

const features = [
  {
    title: 'Task Management',
    description: 'Create, organize, and track tasks with ease. Set priorities and deadlines.',
    icon: CheckCircle2,
  },
  {
    title: 'Team Collaboration',
    description: 'Work together seamlessly with real-time updates and communication.',
    icon: CheckCircle2,
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor project progress and team performance with detailed insights.',
    icon: CheckCircle2,
  },
];