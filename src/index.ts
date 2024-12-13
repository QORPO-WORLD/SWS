import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes';
import swaggerJson from '../public/swagger.json';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));

RegisterRoutes(app);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API documentation at http://localhost:${PORT}/docs`);
});