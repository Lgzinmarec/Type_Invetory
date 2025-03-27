import * as readline from 'readline-sync';
import { CategoryService } from "../services/CategoryService";
import { ProductService } from "../services/ProductService";

export class CLIHelper {
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  private displayMenu(): void {
    console.log('\n=== Sistema de Gerenciamento de Inventário ===');
    console.log('1. Gerenciar Categorias');
    console.log('2. Gerenciar Produtos');
    console.log('0. Sair');
  }

  private displayCategoryMenu(): void {
    console.log('\n=== Gerenciamento de Categorias ===');
    console.log('1. Criar Categoria');
    console.log('2. Listar Todas as Categorias');
    console.log('3. Buscar Categoria por ID');
    console.log('4. Buscar Categoria por Nome');
    console.log('5. Atualizar Categoria');
    console.log('6. Remover Categoria');
    console.log('0. Voltar');
  }

  private displayProductMenu(): void {
    console.log('\n=== Gerenciamento de Produtos ===');
    console.log('1. Criar Produto');
    console.log('2. Listar Todos os Produtos');
    console.log('3. Buscar Produto por ID');
    console.log('4. Buscar Produto por Nome');
    console.log('5. Buscar Produtos por Categoria');
    console.log('6. Atualizar Produto');
    console.log('7. Remover Produto');
    console.log('0. Voltar');
  }

  public start(): void {
    let running = true;

    while (running) {
      this.displayMenu();
      const choice = readline.question('Escolha uma opção: ');

      switch (choice) {
        case '1':
          this.handleCategoryMenu();
          break;
        case '2':
          this.handleProductMenu();
          break;
        case '0':
          running = false;
          console.log('Saindo do sistema...');
          break;
        default:
          console.log('Opção inválida!');
      }
    }
  }

  private handleCategoryMenu(): void {
    let back = false;

    while (!back) {
      this.displayCategoryMenu();
      const choice = readline.question('Escolha uma opção: ');

      switch (choice) {
        case '1':
          this.createCategory();
          break;
        case '2':
          this.listCategories();
          break;
        case '3':
          this.findCategoryById();
          break;
        case '4':
          this.findCategoryByName();
          break;
        case '5':
          this.updateCategory();
          break;
        case '6':
          this.deleteCategory();
          break;
        case '0':
          back = true;
          break;
        default:
          console.log('Opção inválida!');
      }
    }
  }

  private handleProductMenu(): void {
    let back = false;

    while (!back) {
      this.displayProductMenu();
      const choice = readline.question('Escolha uma opção: ');

      switch (choice) {
        case '1':
          this.createProduct();
          break;
        case '2':
          this.listProducts();
          break;
        case '3':
          this.findProductById();
          break;
        case '4':
          this.findProductByName();
          break;
        case '5':
          this.findProductsByCategory();
          break;
        case '6':
          this.updateProduct();
          break;
        case '7':
          this.deleteProduct();
          break;
        case '0':
          back = true;
          break;
        default:
          console.log('Opção inválida!');
      }
    }
  }

  private createCategory(): void {
    console.log('\n--- Criar Nova Categoria ---');
    const name = readline.question('Nome: ');
    const description = readline.question('Descrição (opcional): ');

    const newCategory = this.categoryService.create({
      name,
      description: description || undefined
    });

    if (newCategory) {
      console.log('Categoria criada com sucesso!');
      console.log(`ID: ${newCategory.id}`);
    } else {
      console.log('Erro ao criar categoria.');
    }
  }

  private listCategories(): void {
    const categories = this.categoryService.findAll();
    console.log('\n--- Todas as Categorias ---');
    if (categories.length === 0) {
      console.log('Nenhuma categoria cadastrada.');
    } else {
      console.table(categories);
    }
  }

  private findCategoryById(): void {
    console.log('\n--- Buscar Categoria por ID ---');
    const id = readline.question('ID da categoria: ');
    const category = this.categoryService.findById(id);

    if (category) {
      console.log('\nCategoria encontrada:');
      console.log(`ID: ${category.id}`);
      console.log(`Nome: ${category.name}`);
      console.log(`Descrição: ${category.description || 'Nenhuma'}`);
      console.log(`Data de criação: ${category.createdAt}`);
    } else {
      console.log('Categoria não encontrada!');
    }
  }

  private findCategoryByName(): void {
    console.log('\n--- Buscar Categoria por Nome ---');
    const name = readline.question('Nome da categoria: ');
    const category = this.categoryService.findByName(name);

    if (category) {
      console.log('\nCategoria encontrada:');
      console.log(`ID: ${category.id}`);
      console.log(`Nome: ${category.name}`);
      console.log(`Descrição: ${category.description || 'Nenhuma'}`);
      console.log(`Data de criação: ${category.createdAt}`);
    } else {
      console.log('Categoria não encontrada!');
    }
  }

  private updateCategory(): void {
    console.log('\n--- Atualizar Categoria ---');
    const id = readline.question('ID da categoria a ser atualizada: ');
    
    const currentCategory = this.categoryService.findById(id);
    if (!currentCategory) {
      console.log('Categoria não encontrada!');
      return;
    }

    console.log('\nDeixe em branco para manter o valor atual');
    console.log(`Valor atual: ${currentCategory.name}`);
    const name = readline.question('Novo nome: ') || currentCategory.name;

    console.log(`Valor atual: ${currentCategory.description || 'Nenhuma'}`);
    const description = readline.question('Nova descrição: ') || currentCategory.description;

    const updated = this.categoryService.update(id, { name, description });
    
    if (updated) {
      console.log('Categoria atualizada com sucesso!');
    } else {
      console.log('Erro ao atualizar categoria!');
    }
  }

  private deleteCategory(): void {
    console.log('\n--- Remover Categoria ---');
    const id = readline.question('ID da categoria a ser removida: ');
    
    const success = this.categoryService.delete(id);
    
    if (success) {
      console.log('Categoria removida com sucesso!');
    } else {
      console.log('Erro ao remover categoria. Verifique se existe ou se não tem produtos vinculados.');
    }
  }

  private createProduct(): void {
    console.log('\n--- Criar Novo Produto ---');
    
    const categories = this.categoryService.findAll();
    if (categories.length === 0) {
      console.log('Nenhuma categoria cadastrada. Crie uma categoria primeiro.');
      return;
    }

    console.log('\nCategorias disponíveis:');
    categories.forEach(cat => console.log(`- ${cat.id}: ${cat.name}`));

    const name = readline.question('Nome do produto: ');
    const description = readline.question('Descrição (opcional): ');
    const price = parseFloat(readline.question('Preço: '));
    const quantity = parseInt(readline.question('Quantidade: '));
    const categoryId = readline.question('ID da categoria: ');

    const newProduct = this.productService.create({
      name,
      description: description || undefined,
      price,
      quantity,
      categoryId
    });

    if (newProduct) {
      console.log('Produto criado com sucesso!');
      console.log(`ID: ${newProduct.id}`);
    } else {
      console.log('Erro ao criar produto. Verifique se a categoria existe.');
    }
  }

  private listProducts(): void {
    const products = this.productService.findAll();
    console.log('\n--- Todos os Produtos ---');
    if (products.length === 0) {
      console.log('Nenhum produto cadastrado.');
    } else {
      console.table(products.map(p => ({
        ID: p.id,
        Nome: p.name,
        Preço: p.price,
        Quantidade: p.quantity,
        Categoria: p.categoryId
      })));
    }
  }

  private findProductById(): void {
    console.log('\n--- Buscar Produto por ID ---');
    const id = readline.question('ID do produto: ');
    const product = this.productService.findById(id);

    if (product) {
      console.log('\nProduto encontrado:');
      console.log(`ID: ${product.id}`);
      console.log(`Nome: ${product.name}`);
      console.log(`Descrição: ${product.description || 'Nenhuma'}`);
      console.log(`Preço: ${product.price}`);
      console.log(`Quantidade: ${product.quantity}`);
      console.log(`Categoria ID: ${product.categoryId}`);
      console.log(`Data de criação: ${product.createdAt}`);
      console.log(`Última atualização: ${product.updatedAt}`);
    } else {
      console.log('Produto não encontrado!');
    }
  }

  private findProductByName(): void {
    console.log('\n--- Buscar Produto por Nome ---');
    const name = readline.question('Nome do produto: ');
    const products = this.productService.findByName(name);

    if (products.length > 0) {
      console.log('\nProdutos encontrados:');
      console.table(products.map(p => ({
        ID: p.id,
        Nome: p.name,
        Preço: p.price,
        Quantidade: p.quantity,
        Categoria: p.categoryId
      })));
    } else {
      console.log('Nenhum produto encontrado com esse nome!');
    }
  }

  private findProductsByCategory(): void {
    console.log('\n--- Buscar Produtos por Categoria ---');
    const categoryId = readline.question('ID da categoria: ');
    const products = this.productService.findByCategory(categoryId);

    if (products.length > 0) {
      console.log('\nProdutos encontrados:');
      console.table(products.map(p => ({
        ID: p.id,
        Nome: p.name,
        Preço: p.price,
        Quantidade: p.quantity
      })));
    } else {
      console.log('Nenhum produto encontrado para esta categoria!');
    }
  }

  private updateProduct(): void {
    console.log('\n--- Atualizar Produto ---');
    const id = readline.question('ID do produto a ser atualizado: ');
    
    const currentProduct = this.productService.findById(id);
    if (!currentProduct) {
      console.log('Produto não encontrado!');
      return;
    }

    console.log('\nDeixe em branco para manter o valor atual');
    console.log(`Valor atual: ${currentProduct.name}`);
    const name = readline.question('Novo nome: ') || currentProduct.name;

    console.log(`Valor atual: ${currentProduct.description || 'Nenhuma'}`);
    const description = readline.question('Nova descrição: ') || currentProduct.description;

    console.log(`Valor atual: ${currentProduct.price}`);
    const priceInput = readline.question('Novo preço: ');
    const price = priceInput ? parseFloat(priceInput) : currentProduct.price;

    console.log(`Valor atual: ${currentProduct.quantity}`);
    const quantityInput = readline.question('Nova quantidade: ');
    const quantity = quantityInput ? parseInt(quantityInput) : currentProduct.quantity;

    const categories = this.categoryService.findAll();
    console.log('\nCategorias disponíveis:');
    categories.forEach(cat => console.log(`- ${cat.id}: ${cat.name}`));
    console.log(`Valor atual: ${currentProduct.categoryId}`);
    const categoryId = readline.question('Novo ID de categoria: ') || currentProduct.categoryId;

    const updated = this.productService.update(id, { 
      name, 
      description, 
      price, 
      quantity, 
      categoryId 
    });
    
    if (updated) {
      console.log('Produto atualizado com sucesso!');
    } else {
      console.log('Erro ao atualizar produto. Verifique se a nova categoria existe.');
    }
  }

  private deleteProduct(): void {
    console.log('\n--- Remover Produto ---');
    const id = readline.question('ID do produto a ser removido: ');
    
    const success = this.productService.delete(id);
    
    if (success) {
      console.log('Produto removido com sucesso!');
    } else {
      console.log('Erro ao remover produto. Verifique se o ID existe.');
    }
  }
}