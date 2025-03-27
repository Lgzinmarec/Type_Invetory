import { CategoryService } from "./services/CategoryService";
import { ProductService } from "./services/ProductService";
import { CLIHelper } from "./utils/CLIHelper";

const categoryService = new CategoryService();
const productService = new ProductService(categoryService);

const cli = new CLIHelper(categoryService, productService);

cli.start();