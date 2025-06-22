const request = require('supertest');
const { app, todos, resetState } = require('./index'); // Import resetState for resetting

beforeEach(() => {
  // Reset the todos array and nextId before each test
  resetState();
});

describe('TODO API', () => {
  // Test for creating a new todo
  it('should create a new todo', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ title: 'Test Todo' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Todo');
    expect(res.body.completed).toBe(false);
  });

  // Test for retrieving all todos
  it('should get all todos', async () => {
    await request(app).post('/todos').send({ title: 'Todo 1' });
    await request(app).post('/todos').send({ title: 'Todo 2' });
    const res = await request(app).get('/todos');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  // Test for updating a todo
  it('should update a todo', async () => {
    const createRes = await request(app).post('/todos').send({ title: 'To Update' });
    const id = createRes.body.id;
    const res = await request(app)
      .put(`/todos/${id}`)
      .send({ title: 'Updated', completed: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated');
    expect(res.body.completed).toBe(true);
  });

  // Test for deleting a todo
  it('should delete a todo', async () => {
    const createRes = await request(app).post('/todos').send({ title: 'To Delete' });
    const id = createRes.body.id;
    const res = await request(app).delete(`/todos/${id}`);
    expect(res.statusCode).toBe(204);
    const getRes = await request(app).get('/todos');
    expect(getRes.body.find(t => t.id === id)).toBeUndefined();
  });

  // Test for updating a non-existent todo
  it('should return 404 for updating non-existent todo', async () => {
    const res = await request(app).put('/todos/999').send({ title: 'Nope' });
    expect(res.statusCode).toBe(404);
  });

  // Test for deleting a non-existent todo
  it('should return 404 for deleting non-existent todo', async () => {
    const res = await request(app).delete('/todos/999');
    expect(res.statusCode).toBe(404);
  });

  // Test for creating a todo without a title
  it('should return 400 for creating todo without title', async () => {
    const res = await request(app).post('/todos').send({});
    expect(res.statusCode).toBe(400);
  });
});
