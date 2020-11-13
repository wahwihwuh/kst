import FoodMenuRepo from '../repositories/FoodMenuRepo';
import { validateCreate, validateUpdate } from '../helper/validator'

exports.insertFoodMenu = async (req, res) => {
    const foodMenu = {
        category: {
            id: req.body.category.id,
            name: req.body.category.name || ''
        },
        menu: {
            name: req.body.name || '',
            price: req.body.price
        }
    }

    const { valid, errors } = validateCreate(foodMenu);
    if (!valid) {
        throw new Error(JSON.stringify(errors));
    }

    const data = await FoodMenuRepo.insert(foodMenu);
    const result = await FoodMenuRepo.getOne(data.rows[0].id);

    const response = {
        category: {
            id: result.rows[0].categoryid,
            name: result.rows[0].categoryname
        },
        id: result.rows[0].menuid,
        name: result.rows[0].menuname,
        price: result.rows[0].menuprice
    }

    return response;
}

exports.getFoodMenu = async (req, res) => {
    const param = req.query;
    param.items = param.items || 10;
    param.page = param.page || 1;

    const data = await FoodMenuRepo.getAll(param);
    if (data.length === 0 && param.Id !== undefined) throw new Error(`Cannot find any menu with category ID ${param.Id}`);

    const foodMenus = new Map();

    if (data.length > 0) {
        data.forEach(element => {
            const menu = {
                id: element.menuid,
                name: element.menuname,
                price: element.menuprice
            }
            if (foodMenus.has(element.categoryid)) {
                const foodMenu = foodMenus.get(element.categoryid)
                foodMenu.menu.push(menu);
                foodMenus.set(element.categoryid, foodMenu);
            } else {
                const category = {
                    id: element.categoryid,
                    name: element.categoryname,
                    menu: [menu]
                }
                foodMenus.set(element.categoryid, category);
            }
        });
    }

    const result = [];
    for (const foodMenu of foodMenus.values()) {
        result.push(foodMenu);
    }

    if (param.Id !== undefined) return result[0];
    return result;
}

exports.updateFoodMenu = async (req, res) => {
    const request = req.body;

    const { valid, errors } = validateUpdate(request);
    if (!valid) {
        throw new Error(`${errors.id ? errors.id : ''} ${errors.menu ? `, ${errors.menu}` : ''}`);
    }
    
    const data = await FoodMenuRepo.updateMenu(request);
    const result = await FoodMenuRepo.getOne(data.rows[0].id);

    const response = {
        category: {
            id: result.rows[0].categoryid,
            name: result.rows[0].categoryname
        },
        id:result.rows[0].menuid,
        name: result.rows[0].menuname,
        price: result.rows[0].menuprice
    }

    return response;
}

exports.deleteFoodMenu = async (req, res) => {
    const categoryId = req.query.Id;
    const menuId = req.query.menuId;

    if (categoryId !== undefined) {
        const data = await FoodMenuRepo.deleteCategory(categoryId);
        if (data.rowCount === 0) throw new Error(`Cannot find any menu with Category ID ${categoryId}`);
        return;
    }
    if (menuId !== undefined) {
        const data = await FoodMenuRepo.deleteMenu(menuId);
        if (data.rowCount === 0) throw new Error(`Cannot find any menu with Menu ID ${menuId}`);
        return;
    }

    return;
}
