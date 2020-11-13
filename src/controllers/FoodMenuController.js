import FoodMenuSvc from '../services/FoodMenuSvc';

exports.insertFoodMenu = async (req, res) => {
    try { 
        const response = await FoodMenuSvc.insertFoodMenu(req, res)
        return res.json(response);
    } catch (err) {
        return res.status(404).json(JSON.parse(err.message));
    }
}

exports.getFoodMenu = async (req, res) => {
    try { 
        const response = await FoodMenuSvc.getFoodMenu(req, res)
        return res.json(response);
    } catch (err) {
        return res.status(400).json(err.message);
    }
}

exports.updateFoodMenu = async (req, res) => {
    try { 
        const response = await FoodMenuSvc.updateFoodMenu(req, res)
        return res.json(response);
    } catch (err) {
        return res.status(404).json(err.message);
    }
}

exports.deleteFoodMenu = async (req, res) => {
    try { 
        await FoodMenuSvc.deleteFoodMenu(req, res)
        return res.status(201).json();
    } catch (err) {
        return res.status(400).json(err.message);
    }
}
