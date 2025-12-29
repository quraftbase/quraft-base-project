// pages/login.tsx
// 使っていない
// import { useState } from 'react'
// import { useRouter } from 'next/router'
// import { supabase } from '../lib/supabaseClient'

// export default function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [message, setMessage] = useState('')
//   const router = useRouter()

//   const handleLogin = async () => {
//     const { data, error } = await supabase.auth.signInWithPassword({ email, password })
//     console.log(data);
//     if (error) {
//       setMessage(`エラー: ${error.message}`)
//     } else {
//       setMessage('ログイン成功！')
//       router.push('/') // ログイン後にトップページに遷移
//     }
//   }

//   return (
//     <div className="p-6 max-w-md mx-auto mt-20 bg-white shadow rounded">
//       <h1 className="text-2xl font-bold mb-4">ログイン</h1>
//       <input
//         className="border p-2 w-full mb-3 rounded"
//         type="email"
//         placeholder="メールアドレス"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         className="border p-2 w-full mb-3 rounded"
//         type="password"
//         placeholder="パスワード"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button
//         className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
//         onClick={handleLogin}
//       >
//         ログイン
//       </button>
//       {message && <p className="mt-3 text-red-600">{message}</p>}
//     </div>
//   )
// }
