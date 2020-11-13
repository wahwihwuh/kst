import pool from '../core/db';

exports.getAll = async param => {
    const client = await pool.connect();

    const query = {
        text: `SELECT category.id as categoryId, category.name as categoryName, menu.id as menuId, menu.name as menuName, menu.price as menuPrice
            FROM (SELECT * FROM category LIMIT $2 OFFSET ($3 - 1) * $2) category INNER JOIN menu on category.id = menu.category_id 
            WHERE category.id = COALESCE($1, category.id);`,
        values: [param.Id, param.items, param.page],
    }
    try {
        const res = await client.query(query);
        return res.rows;
    } finally {
        client.release()
    }
}

exports.getOne = async (id) => {
    const client = await pool.connect()
    try {
        const query = {
            text: `SELECT category.id as categoryId, category.name as categoryName, menu.id as menuId, menu.name as menuName, menu.price as menuPrice
                FROM category INNER JOIN menu on category.id = menu.category_id WHERE menu.id = $1`,
            values: [id],
        }
        const res = await client.query(
            query
        );
        return res;
    } finally {
        client.release()
    }
}

exports.insert = async (data) => {
    const client = await pool.connect()
    try {
        const query = {
            text:
                `
                    with temp as (
                        INSERT INTO category (
                            ${!data.category.id ? '' : 'id,'}
                            name
                        ) values (
                            ${!data.category.id ? '' : '$4,'}
                            $1
                        ) on conflict (name) do nothing returning id
                    )
                    INSERT INTO menu (name, price, category_id) VALUES ($2, $3, COALESCE((SELECT id from temp), (SELECT id FROM category WHERE name = $1))) returning id;
                `,
            values: [data.category.name, data.menu.name, data.menu.price, data.category.id],
        }
        if (!data.category.id) query.values.pop();
        const res = await client.query(
            query
        );
        return res;
    } finally {
        client.release()
    }
}

exports.updateMenu = async (data) => {
    const client = await pool.connect()
    try {
        const query = {
            text: `UPDATE menu SET name = COALESCE($1, name), price = COALESCE($2, price) WHERE id = $3 RETURNING id;`,
            values: [data.name, data.price, data.id],
        }
        const res = await client.query(
            query
        );
        return res;
    } finally {
        client.release()
    }
}

exports.deleteCategory = async (id) => {
    const client = await pool.connect()
    try {
        const query = {
            text: `DELETE FROM category WHERE id = $1;`,
            values: [id],
        }
        const res = await client.query(
            query
        );
        return res;
    } finally {
        client.release()
    }
}

exports.deleteMenu = async (id) => {
    const client = await pool.connect()
    try {
        const query = {
            text: `DELETE FROM menu WHERE id = $1;`,
            values: [id],
        }
        const res = await client.query(
            query
        );
        return res;
    } finally {
        client.release()
    }
}
