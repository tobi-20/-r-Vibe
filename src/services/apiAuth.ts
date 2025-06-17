import toast from "react-hot-toast";
import { SignInInputs, SignupInputs } from "../utils/models";
import supabase from "./supabase";

export async function signup({fullName, email, password}:SignupInputs) {
  const {data, error} = await supabase.auth.signUp({
    email, password, options:{
      data:{
        fullName,
        avatar: '',
      }
    }
  })
  if (error) throw new Error (error.message);

  return data;
  
}

export async function login({ email, password }: SignInInputs) {
  const { data, error} = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) toast.error("Provided email or password are incorrect");
  return data;
}

export async function getCurrentUser(){
  const {data: session}= await supabase.auth.getSession();
  if(!session.session)return null;

  const {data, error} = await supabase.auth.getUser();
  console.log(data)
  if (error) toast.error("Provided email or password are incorrect");
    return data?.user
}

export async function logout(){
  const {error} = await supabase.auth.signOut();
  if (error) throw new Error (error.message)
}