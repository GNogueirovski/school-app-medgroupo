import { createServer, Model, Registry, Server } from 'miragejs';
import { ModelDefinition } from 'miragejs/-types';
import Schema from 'miragejs/orm/schema';
import { Shift, School } from '@/features/schools/types';
import { Class } from '@/features/classes/types';

const SchoolModel: ModelDefinition<Omit<School, 'id'>> = Model.extend({});
const ClassModel: ModelDefinition<Omit<Class, 'id'>> = Model.extend({});

type AppRegistry = Registry<{
  school: typeof SchoolModel;
  class: typeof ClassModel;
}, {}>;

type AppSchema = Schema<AppRegistry>;

export function makeServer() {
  return createServer({
    models: {
      school: SchoolModel,
      class: ClassModel,
    },

    seeds(server: Server<AppRegistry>) {
      const dumont = server.create('school', {
        name: 'E.E. Santos Dumont',
        address: 'Rua das Flores, 123 - Centro',
      });
      const domPedro = server.create('school', {
        name: 'E.M. Dom Pedro II',
        address: 'Av. Brasil, 456 - Jardim América',
      });
      const tiradentes = server.create('school', {
        name: 'C.E. Tiradentes',
        address: 'Rua da Liberdade, 789 - Vila Nova',
      });

      server.create('class', { schoolId: dumont.id, name: '1º A', shift: Shift.Morning, academicYear: 2024 });
      server.create('class', { schoolId: dumont.id, name: '2º B', shift: Shift.Afternoon, academicYear: 2024 });
      server.create('class', { schoolId: dumont.id, name: '3º C', shift: Shift.Evening, academicYear: 2024 });

      server.create('class', { schoolId: domPedro.id, name: '1º A', shift: Shift.Morning, academicYear: 2024 });
      server.create('class', { schoolId: domPedro.id, name: '2º A', shift: Shift.Morning, academicYear: 2024 });

      server.create('class', { schoolId: tiradentes.id, name: '3º A', shift: Shift.Afternoon, academicYear: 2024 });
      server.create('class', { schoolId: tiradentes.id, name: '1º B', shift: Shift.Evening, academicYear: 2024 });
    },

    routes() {
      this.urlPrefix = 'http://localhost';
      this.namespace = '';

      this.get('/schools', (schema: AppSchema) => {
        const schools = schema.all('school').models;
        const allClasses = schema.all('class').models;

        return schools.map((school) => {
          const schoolClasses = allClasses.filter((c) => c.schoolId === school.id);
          const shifts = [...new Set(schoolClasses.map((c) => c.shift))];
          return {
            id: school.id,
            name: school.name,
            address: school.address,
            classCount: schoolClasses.length,
            shifts,
          };
        });
      });

      this.post('/schools', (schema: AppSchema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const school = schema.create('school', attrs);
        return { id: school.id, ...school.attrs };
      });

      this.put('/schools/:id', (schema: AppSchema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const school = schema.find('school', request.params.id);
        if (!school) return {};
        school.update(attrs);
        return { id: school.id, ...school.attrs };
      });

      this.del('/schools/:id', (schema: AppSchema, request) => {
        const school = schema.find('school', request.params.id);
        if (school) school.destroy();
        return {};
      });

      this.get('/classes', (schema: AppSchema, request) => {
        const { schoolId } = request.queryParams as { schoolId?: string };
        const allClasses = schema.all('class').models;
        const filtered = schoolId ? allClasses.filter((c) => c.schoolId === schoolId) : allClasses;
        return filtered.map((c) => ({
          id: c.id,
          schoolId: c.schoolId,
          name: c.name,
          shift: c.shift,
          academicYear: c.academicYear,
        }));
      });

      this.post('/classes', (schema: AppSchema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const classItem = schema.create('class', attrs);
        return { id: classItem.id, ...classItem.attrs };
      });

      this.put('/classes/:id', (schema: AppSchema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const classItem = schema.find('class', request.params.id);
        if (!classItem) return {};
        classItem.update(attrs);
        return { id: classItem.id, ...classItem.attrs };
      });

      this.del('/classes/:id', (schema: AppSchema, request) => {
        const classItem = schema.find('class', request.params.id);
        if (classItem) classItem.destroy();
        return {};
      });
    },
  });
}
