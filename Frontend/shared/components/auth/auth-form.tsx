"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Brain, GraduationCap } from "lucide-react"
import type { AuthFormProps, UserRole } from "@/shared/types/user"
import {useDispatch} from "react-redux";
import { loginAction, loginThunk, registerThunk } from "@/redux/slice/authSlice"
import { loginApi } from "@/shared/services/auth-service"
import { jwtDecode, JwtPayload } from "jwt-decode"
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import loginValidationSchema from "@/shared/utils/validation_schemas/loginValidationSchema"
import { AppDispatch } from "@/redux/store/store"
import registerValidationSchema from "@/shared/utils/validation_schemas/registerValidationSchema"

interface RoleOption {
  id: UserRole
  name: string
  color: string
  description: string
}

export function AuthForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("login")
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")


   const handleLoginSubmit = async (values: { username: string; password: string },actions: any) => {
   

      try {
        const payload = await dispatch(loginThunk({ username: values.username, password: values.password })).unwrap();

      } catch (error: any) {
        const errorMessage = error || 'Login failed';

        if (typeof errorMessage === 'string') {
          if (errorMessage.includes('Invalid Credentials')) {
            actions.setFieldError('username', 'Invalid username or password');
            actions.setFieldError('password', 'Invalid username or password');
          } else if (errorMessage.includes('User not found')) {
            actions.setFieldError('username', 'User not found');
          }  else if (errorMessage.includes('')) {
              actions.setFieldError('username', 'Your account is pending admin approval.');}
          else {
            actions.setFieldError('password','Something went wrong. Please try again later.');
          }
        }

      } finally {
        actions.setSubmitting(false);
      }}

  const roles: RoleOption[] = [
    { id: "WRITER", name: "Writer", color: "bg-blue-500", description: "Create questions and quizzes" },
    { id: "TEACHER", name: "Teacher", color: "bg-green-500", description: "Manage classes and assignments" },
    { id: "STUDENT", name: "Student", color: "bg-purple-500", description: "Join classes and take quizzes" },
  ]


 function handleRegisterSubmit(
  values: any,
  formikHelpers: FormikHelpers<any>
): void | Promise<any> {
  return dispatch(registerThunk(values))
    .unwrap()
    .then((res) => {
      setActiveTab("login")
    })
    .catch((error) => {
      if (
        error.code === "INTERNAL_ERROR" &&
        error.message &&
        error.message.includes("duplicate key value violates unique constraint")
      ) {
        formikHelpers.setFieldError("username", "This username is already taken");
      }})
     
    
    .finally(() => {
      formikHelpers.setSubmitting(false);
    });
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">StudyHub</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Brain className="h-4 w-4 text-gray-600" />
            <p className="text-gray-600">Powered by Gemini AI</p>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Welcome to StudyHub</CardTitle>
            <CardDescription>Sign in to access your personalized dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <Formik
                  initialValues={{ username: "", password: "" }}
                  validationSchema={loginValidationSchema}
                  onSubmit={handleLoginSubmit}
                >
                  {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Field name="username" as={Input} id="username" placeholder="Enter your username" />
                        <ErrorMessage name="username" component="div"  className="text-sm text-red-500" style={{ color: 'hsl(0, 100%, 50%)', fontSize: '0.875rem' }} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Field name="password" as={Input} id="password" type="password" placeholder="Enter your password" />
                        <ErrorMessage name="password" component="div" style={{ color: 'hsl(0, 100%, 50%)', fontSize: '0.875rem' }}
 className="text-sm text-red-500" />
                      </div>

                      <Button type="submit" className="w-full">
                        Sign In
                      </Button>
                    </Form>
                  )}
              </Formik>
              </TabsContent>

               
    <TabsContent value="register" className="space-y-4">
      <Formik
        initialValues={{
          fullName: "",
          username: "",
          password: "",
          role: "",
        }}
        validationSchema={registerValidationSchema}
        onSubmit={handleRegisterSubmit}
      >
        {({ values, handleChange, handleBlur, setFieldValue, errors, touched, isSubmitting }) => (
          <Form>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby="fullNameError"
              />
              <ErrorMessage
                name="fullName"
                component="div"
                className="text-red-600 text-sm mt-1"
                id="fullNameError"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter your username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby="usernameError"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-600 text-sm mt-1"
                id="usernameError"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby="passwordError"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-600 text-sm mt-1"
                id="passwordError"
              />
            </div>

            <div className="space-y-3">
              <Label>Select Your Role</Label>
              <div className="grid grid-cols-1 gap-2">
                {roles.map((role) => (
                  <Button
                    key={role.id}
                    type="button"
                    variant={values.role === role.id ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setFieldValue("role", role.id)}
                  >
                    <Badge className={`${role.color} text-white mr-2`}>{role.name}</Badge>
                    {role.description}
                  </Button>
                ))}
              </div>
              {errors.role && touched.role && (
                <div className="text-red-600 text-sm mt-1">{errors.role}</div>
              )}
            </div>
            
            <Button type="submit" className="w-full " disabled={isSubmitting}>
              Create Account
            </Button>
          </Form>
        )}
      </Formik>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
