import './tracing.js';
import app from './app.js';

app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});

