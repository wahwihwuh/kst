export function validateCreate(data) {
    const errors = {};

    if (data.category.name.trim() === '') {
        errors.category = 'Category name must not be empty';
    }

    if (data.menu.name.trim() === '') {
        errors.menu = 'Menu name must not be empty';
    }

    if (data.menu.price === undefined) {
        errors.menuPrice = 'Price is required'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

export function validateUpdate(data) {
    const errors = {};
    if (data.id === undefined) {
        errors.id = 'id is required';
    }

    if (data.name === undefined && data.price === undefined) {
        errors.menu = 'Menu name or price is required';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}
