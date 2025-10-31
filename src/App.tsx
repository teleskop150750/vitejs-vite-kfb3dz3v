import { useForm } from '@tanstack/react-form';

import { useMutation, useQuery } from '@tanstack/react-query';

import { memo } from 'react';
import { db } from './Db';

function UserForm({
  initialData,
  refetch,
}: {
  initialData: { firstName: string; lastName: string };
  refetch: () => Promise<any>;
}) {
  const saveUserMutation = useMutation({
    mutationFn: async (value: { firstName: string; lastName: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      db.saveUser(value);
    },
  });
  const defaultValues = {
    firstName: initialData.firstName,
    lastName: initialData.lastName,
  };

  //   console.error('RERENDER USER FORM', defaultValues)

  const form = useForm({
    defaultValues,
    onSubmit: async ({ formApi, value }) => {
      await saveUserMutation.mutateAsync(value);
      await refetch();
      formApi.reset(initialData, {keepDefaultValues: true});
    },
  });

  return (
    <div className="revert-all">
      <h1>Simple Form Example</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <form.Field
            name="firstName"
            children={(field) => {
              console.error('RERENDER FIELD', field.name, field.state.value);
              return (
                <>
                  <label htmlFor={field.name}>First Name:</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </>
              );
            }}
          />
        </div>
        <div>
          <form.Field
            name="lastName"
            children={(field) => (
              <>
                <label htmlFor={field.name}>Last Name:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          />
        </div>
          <button type="submit">Save</button>
      </form>
    </div>
  );
}

export const App = memo(() => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return db.getData();
    },
  });

  if (error) {
    return (
      <div className="error-state">
        <h2>Error</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  // Обработка загрузки
  if (isLoading || !data) {
    return (
      <div className="loading-state">
        <p>Loading</p>
      </div>
    );
  }

  return <UserForm initialData={data} refetch={refetch} />;
});
