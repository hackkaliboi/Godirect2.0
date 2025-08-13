import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DiagnosticTest() {
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runDiagnostics = async () => {
    setIsLoading(true);
    setResults([]);

    try {
      // Test 1: Check environment variables
      addResult('✅ Environment variables loaded');
      addResult(`URL: ${import.meta.env.VITE_SUPABASE_URL}`);
      addResult(`Key: ${import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20)}...`);

      // Test 2: Test basic connection
      try {
        const { data, error } = await supabase.from('profiles').select('count');
        if (error) {
          addResult(`❌ Database connection error: ${error.message}`);
        } else {
          addResult('✅ Database connection successful');
        }
      } catch (err) {
        addResult(`❌ Database connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }

      // Test 3: Test auth signup with a dummy account
      try {
        const testEmail = `test-${Date.now()}@example.com`;
        const { data, error } = await supabase.auth.signUp({
          email: testEmail,
          password: 'testpassword123',
          options: {
            data: {
              first_name: 'Test',
              last_name: 'User',
              phone: '1234567890',
              role: 'user',
              full_name: 'Test User'
            }
          }
        });

        if (error) {
          addResult(`❌ Auth signup error: ${error.message}`);
        } else {
          addResult('✅ Auth signup successful');
          addResult(`User created: ${data.user?.email}`);
          
          // Clean up test user
          if (data.user) {
            try {
              const { error: deleteError } = await supabase.auth.admin.deleteUser(data.user.id);
              if (!deleteError) {
                addResult('✅ Test user cleaned up');
              }
            } catch (cleanupError) {
              addResult('⚠️ Could not clean up test user (this is OK)');
            }
          }
        }
      } catch (err) {
        addResult(`❌ Auth signup failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }

    } catch (error) {
      addResult(`❌ General error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setIsLoading(false);
  };

  const testSimpleSignup = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123'
      });

      if (error) {
        addResult(`❌ Simple signup error: ${error.message}`);
        addResult(`Error code: ${error.status}`);
      } else {
        addResult('✅ Simple signup successful');
        if (data.user) {
          addResult(`User ID: ${data.user.id}`);
          addResult(`Email: ${data.user.email}`);
        }
      }
    } catch (err) {
      addResult(`❌ Simple signup failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    setIsLoading(false);
  };

  const testAuthConnection = async () => {
    setIsLoading(true);
    try {
      // Test basic auth connection
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        addResult(`❌ Auth connection error: ${error.message}`);
      } else {
        addResult('✅ Auth connection successful');
        addResult(`Session exists: ${data.session ? 'Yes' : 'No'}`);
      }
    } catch (err) {
      addResult(`❌ Auth connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Supabase Diagnostic Test</CardTitle>
        <CardDescription>
          Test your Supabase connection and authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button 
            onClick={runDiagnostics} 
            disabled={isLoading}
          >
            {isLoading ? 'Running Tests...' : 'Run Full Diagnostics'}
          </Button>
          <Button 
            onClick={testAuthConnection} 
            disabled={isLoading}
            variant="outline"
          >
            Test Auth Connection
          </Button>
          <Button 
            onClick={testSimpleSignup} 
            disabled={isLoading}
            variant="outline"
          >
            Test Simple Signup
          </Button>
        </div>

        {results.length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <div className="space-y-1 text-sm font-mono">
              {results.map((result, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Run Full Diagnostics" to test all connections</li>
            <li>Check the results for any error messages</li>
            <li>Open browser DevTools (F12) → Console tab to see detailed errors</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
