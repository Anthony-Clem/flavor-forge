export interface AuthParams {
  email: string;
  password: string;
}

export interface UserParams {
  id: string;
  firstName: string;
  lastName: string;
}

export interface GenerateRecipeParams {
  userId: string;
  dishName: string;
  servingSize: number;
}

export interface IngredientType {
  name: string;
  quantity: string;
}
