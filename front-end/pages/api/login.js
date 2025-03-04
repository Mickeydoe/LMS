import withSession from '@/lib/session'
import axios from 'axios';


export default withSession(async (req, res) => {
    const { username, password } = req.body;

    // Ensure the environment variable is defined
    if (!process.env.NEXT_PUBLIC_BACKEND_API_HOST) {
        console.error('BACKEND_API_HOST is not defined');
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    const loginUrl = process.env.NEXT_PUBLIC_BACKEND_API_HOST + '/api/login';
    console.log('Login URL:', loginUrl); 

    try {
        const response = await axios.post(loginUrl, {username: username, password: password});

        if (response.status === 200) {
            const {user, api_token} = response.data;

            req.session.set('user', user)
            req.session.set('api_token', api_token)
            await req.session.save()
            return res.json({logged_in: true});
        }

        const status = response.data.message;
        const errors = response.data.errors;
        return res.json({status, logged_in: false, errors});

    } catch (err) {
        let status = 'Something went wrong';
        let errors = null;

        console.log(err);
        if (err.response) {
            status = err.response.data.message;
            errors = err.response.data.errors;
        }
        return res.json({logged_in: false, status, errors: errors});
    }


})


// import withSession from '@/lib/session';
// import axios from 'axios';

// export default withSession(async (req, res) => {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ message: 'Method Not Allowed' });
//     }

//     try {
//         // Log the request body for debugging
//         console.log("🔹 Received request body:", req.body);

//         // Ensure JSON body is properly parsed
//         const { username, password } = req.body || {};
//         if (!username || !password) {
//             console.error("❌ Missing username or password:", { username, password });
//             return res.status(400).json({ logged_in: false, status: "Username and password are required" });
//         }

//         // Ensure BACKEND_API_HOST is set
//         const backendHost = process.env.NEXT_PUBLIC_BACKEND_API_HOST;
//         if (!backendHost) {
//             console.error("❌ BACKEND_API_HOST is not set");
//             return res.status(500).json({ logged_in: false, status: "Server misconfiguration: BACKEND_API_HOST is missing" });
//         }

//         const loginUrl = `${backendHost}/api/login`;

//         // Send request with correct headers
//         const response = await axios.post(loginUrl, { username, password }, {
//             headers: { "Content-Type": "application/json" }
//         });

//         if (response.status === 200) {
//             const { user, api_token } = response.data;

//             // Save user session
//             req.session.set('user', user);
//             req.session.set('api_token', api_token);
//             await req.session.save();

//             return res.status(200).json({ logged_in: true });
//         }

//         // Handle invalid login response
//         return res.status(401).json({
//             logged_in: false,
//             status: response.data.message || "Invalid credentials",
//             errors: response.data.errors || null,
//         });

//     } catch (err) {
//         console.error("❌ Login Error:", err.response?.data || err.message);

//         return res.status(err.response?.status || 500).json({
//             logged_in: false,
//             status: err.response?.data?.message || "Something went wrong",
//             errors: err.response?.data?.errors || null,
//         });
//     }
// });
