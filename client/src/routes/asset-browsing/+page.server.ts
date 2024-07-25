// import { error } from '@sveltejs/kit';
import { createPool, sql } from '@vercel/postgres'
import { POSTGRES_URL } from '$env/static/private'

export async function load() {
  const db = createPool({ connectionString: POSTGRES_URL })

  try {
    const { rows: assets } = await db.query('SELECT * FROM assets')
    return {
      assets: assets,
    }
  } catch (error) {
      console.log(
        'Table does not exist, creating and seeding it with dummy data now...'
      )
      // Table is not created yet
      await seed()
      const { rows: assets } = await db.query('SELECT * FROM assets')
      return {
        assets: assets
      }
    } 
}

async function seed() {
  const db = createPool({ connectionString: POSTGRES_URL })
  const client = await db.connect();
  const createTable = await client.sql`CREATE TABLE IF NOT EXISTS assets (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      price VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      image VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `

  console.log(`Created "asset" table`)

  const assets = await Promise.all([
    client.sql`
          INSERT INTO assets (name, description, price, category, image)
          VALUES ('Asset1', 'testing asset', '500', 'software', 'testing image');
      `,
  ])
  console.log(`Seeded ${assets.length} assets`)

  return {
    createTable,
    assets,
  }
}


// async function updateAsset(asset) {
//   console.log('asset',asset);
//   const pool = createPool({
//       connectionString: SECRET_POSTGRES_STRING,
//     });   

//     //update the user
//     const result =await pool.sql`UPDATE users 
//     SET firstname = ${user.firstname}, lastname = ${user.lastname}, email = ${user.email} WHERE id = ${user.id}`;

//   return {
//     result
//   };
// }

/** @type {import('./$types').Actions} */
export const actions = {
  
  // update: async ({ request }) => {
  //   const req = await request.formData();

  //   const id = req.get('id');
  //   const name = req.get('name');
  //   const email = req.get('email');

  //   const data = {
  //     id, name, email
  //   }

  //   let updateRes = {
  //     error : false, email : email, name, messsage : ''
  //   }

  //   try {
  //     const res = await updateUser(data);
  //     console.log('update api request ran');
  //     console.log(res);


  //   } catch (error) {
  //       console.log('update api request errored');
  //       console.log(error)
  //       updateRes.error = true;
  //       updateRes.messsage = error.messsage;
  //   }finally{
  //     return updateRes
  //   }
  // },
  

  delete: async ({ request }) => {
    const data = await request.formData();
    const db = createPool({ connectionString: POSTGRES_URL })
    const client = await db.connect();

    const id = data.get('id');

    const deleteAsset = await client.sql`
    DELETE FROM assets
    WHERE id = ${id};`
  
    return { success: true };
  },


  viewasset: async ({ request }) => {
    const data = await request.formData();
    const db = createPool({ connectionString: POSTGRES_URL })
    const client = await db.connect();

    const id = data.get('id');

    const deleteAsset = await client.sql`
    SELECT * FROM assets
    WHERE id = ${id};`
  
    return { success: true };
  },


  filterasset: async ({ request }) => {
    const data = await request.formData();
    const db = createPool({ connectionString: POSTGRES_URL })
    const client = await db.connect();

    const price = data.get('price');
    const category = data.get('category');

    const filterAsset = await client.sql`
    SELECT * FROM assets
    WHERE price = ${price} and category = ${category};`
  
    return { success: true };
  },





  create: async ({request}) => {
    const data = await request.formData();
    const db = createPool({ connectionString: POSTGRES_URL })
    const client = await db.connect();

    const description = data.get('description');
    const name = data.get('name');
    const price = data.get('price');
    const category = data.get('category');
    const image = data.get('image');

    const createAsset = await client.sql`
      INSERT INTO assets (name, description, price, category, image)
      VALUES (${name}, ${description}, ${price}, ${category}, ${image});
    `
    return { success: true };
  }

  
};



