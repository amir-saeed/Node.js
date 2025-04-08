// import User from './User';
// import Property from './Property';
// export { User, Property };

// Make sure User is imported before Property
import './User';
import './Property';

// Re-export models if needed
export { default as User } from './User';
export { default as Property } from './Property';