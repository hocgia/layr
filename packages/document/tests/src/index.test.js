import {Registry} from '@superstore/registry';
import {MemoryStore} from '@superstore/memory-store';

import {Document, field} from '../../..';

describe('@superstore/document', () => {
  test('CRUD operations', async () => {
    class Movie extends Document {
      @field('string') title;

      @field('number') year;
    }

    const store = new MemoryStore();
    const registry = new Registry({Movie, store});

    // Create

    let movie = await new registry.Movie({title: 'Inception', year: 2010});
    await movie.save();
    const id = movie.id; // An 'id' should have been generated automatically
    expect(typeof id === 'string').toBe(true);
    expect(id !== '').toBe(true);

    // Read

    movie = await registry.Movie.get(id);
    expect(movie instanceof registry.Movie).toBe(true);
    expect(movie.id).toBe(id);
    expect(movie.title).toBe('Inception');
    expect(movie.year).toBe(2010);

    await expect(registry.Movie.get('missing-id')).rejects.toThrow();
    await expect(
      registry.Movie.get('missing-id', {throwIfNotFound: false})
    ).resolves.toBeUndefined();

    // movie = store.get({_type: 'Movie', _id: 'abc123'}, {return: {title: true}}); // Partial read
    // expect(movie).toEqual({_type: 'Movie', _id: 'abc123', title: 'Inception'});
    // movie = store.get({_type: 'Movie', _id: 'abc123'}, {return: false}); // Existence check
    // expect(movie).toEqual({_type: 'Movie', _id: 'abc123'});
    // movie = store.get({_type: 'Movie', _id: 'xyz123'}); // Missing document
    // expect(movie).toBeUndefined();
    // movie = store.get({_type: 'Person', _id: 'xyz123'}); // Missing collection
    // expect(movie).toBeUndefined();

    // // Update
    // store.set({_type: 'Movie', _id: 'abc123', title: 'The Matrix', year: undefined});
    // movie = store.get({_type: 'Movie', _id: 'abc123'});
    // expect(movie).toEqual({_type: 'Movie', _id: 'abc123', title: 'The Matrix'});
    // expect(Object.keys(movie).includes('year')).toBe(false); // 'year' has been deleted

    // // Remove
    // let hasBeenDeleted = store.delete({_type: 'Movie', _id: 'abc123'});
    // expect(hasBeenDeleted).toBe(true);
    // movie = store.get({_type: 'Movie', _id: 'abc123'});
    // expect(movie).toBeUndefined();
    // hasBeenDeleted = store.delete({_type: 'Movie', _id: 'abc123'});
    // expect(hasBeenDeleted).toBe(false);
  });

  // test('Nesting documents', () => {
  //   const store = new MemoryStore();

  //   store.set({
  //     _type: 'Movie',
  //     _id: 'abc123',
  //     title: 'Inception',
  //     technicalSpecs: {_type: 'TechnicalSpecs', runtime: 120, aspectRatio: '2.39:1'}
  //   });

  //   let movie = store.get({_type: 'Movie', _id: 'abc123'});
  //   expect(movie).toEqual({
  //     _type: 'Movie',
  //     _id: 'abc123',
  //     title: 'Inception',
  //     technicalSpecs: {_type: 'TechnicalSpecs', runtime: 120, aspectRatio: '2.39:1'}
  //   });

  //   // We cannot partially return nested documents
  //   expect(() => {
  //     movie = store.get(
  //       {_type: 'Movie', _id: 'abc123'},
  //       {return: {technicalSpecs: {runtime: true}}}
  //     );
  //   }).toThrow();

  //   // We cannot partially modify nested documents
  //   store.set({
  //     _type: 'Movie',
  //     _id: 'abc123',
  //     technicalSpecs: {_type: 'TechnicalSpecs', runtime: 130}
  //   });
  //   movie = store.get({_type: 'Movie', _id: 'abc123'});
  //   expect(movie).toEqual({
  //     _type: 'Movie',
  //     _id: 'abc123',
  //     title: 'Inception',
  //     technicalSpecs: {_type: 'TechnicalSpecs', runtime: 130} // 'aspectRatio' is gone
  //   });
  // });

  // test('Referencing documents', () => {
  //   const store = new MemoryStore();

  //   // Let's set both a 'Movie' and a 'Person'
  //   store.set({
  //     _type: 'Movie',
  //     _id: 'abc123',
  //     title: 'Inception',
  //     director: {_type: 'Person', _id: 'xyz123', fullName: 'Christopher Nolan'}
  //   });

  //   // The director can be fetched from 'Person'
  //   let person = store.get({_type: 'Person', _id: 'xyz123'});
  //   expect(person).toEqual({_type: 'Person', _id: 'xyz123', fullName: 'Christopher Nolan'});

  //   // Will fetch both 'Movie' and 'Person'
  //   let movie = store.get({_type: 'Movie', _id: 'abc123'});
  //   expect(movie).toEqual({
  //     _type: 'Movie',
  //     _id: 'abc123',
  //     title: 'Inception',
  //     director: {_type: 'Person', _id: 'xyz123', fullName: 'Christopher Nolan'}
  //   });

  //   // Will fetch 'Movie' only
  //   movie = store.get({_type: 'Movie', _id: 'abc123'}, {return: {title: true, director: {}}});
  //   expect(movie).toEqual({
  //     _type: 'Movie',
  //     _id: 'abc123',
  //     title: 'Inception',
  //     director: {_type: 'Person', _id: 'xyz123'}
  //   });

  //   // The director can be modified through its 'Movie' parent
  //   store.set({
  //     _type: 'Movie',
  //     _id: 'abc123',
  //     director: {_type: 'Person', _id: 'xyz123', fullName: 'C. Nolan'}
  //   });
  //   person = store.get({_type: 'Person', _id: 'xyz123'});
  //   expect(person).toEqual({_type: 'Person', _id: 'xyz123', fullName: 'C. Nolan'});
  // });
});
