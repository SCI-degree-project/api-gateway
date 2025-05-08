export class CreateProductDto {
    name: string;
    description: string;
    price: number;
    materials: string[];
    style: string;
    tenantId: string;
    image: string;
  }
  