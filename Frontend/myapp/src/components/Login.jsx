
import React, {useState} from 'react';


const Login = () => {
    const [email , setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:3000/api/login",{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body : JSON.stringify({email,password})
        });

        const data = await response.json();
        if (response.ok){
            alert("Login Successful");
            localStorage.setItem("token",data.token);
        }else{
            alert(data.message || "Login Failed");
        }
    }
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
                <h2 className='text-2xl font-semibold mb-4 text-center'>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className='mb-4'>
                        <label className='block mb-1 font-medium'>Email:</label>
                        <input type='email' value={email} onChange={(e)=>setEmail(e.target.value)} className='w-full p-2 border rounded' required/>
                    </div>
                    <div className='mb-4'>
                        <label className='block mb-1 font-medium'>Password:</label>
                        <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} className='w-full p-2 border rounded' required/>
                    </div>
                    <button type='submit' className='w-full bg-blue-500 text-white p-2 rounded hover:bg-green-200'>Login</button>
                </form>
            </div> 
        </div>
    );
}

export default Login;
