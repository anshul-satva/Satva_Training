import app from './app';
import { ENV } from './shared/config/env';

app.listen(ENV.PORT, () => {
  console.log(`Server running on http://localhost:${ENV.PORT}`);
});
