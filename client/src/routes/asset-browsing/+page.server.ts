// export const GET = async({ request, url }) => {
//     const authHeader = request.headers.get('Authorization')

//     const res = await fetch('http://localhost:3000/assets/browse')
//     const data = await res.json()
//     return new Response(JSON.stringify(data), { status: 200 })
// }


export const load = ({ fetch }) => {
    const fetchAssets = async() => {
        const res = await fetch('http://localhost:3000/assets/browse')
        const data = await res.json()
    }
}