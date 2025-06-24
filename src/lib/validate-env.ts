// Utility untuk validasi variabel lingkungan

type EnvVar = {
  name: string;
  required?: boolean;
  prefix?: string;
  description: string;
};

export function validateEnv(variables: EnvVar[]): {
  valid: boolean;
  missing: string[];
} {
  const missing: string[] = [];

  for (const variable of variables) {
    const { name, required = true, prefix } = variable;
    const value = prefix ? process.env[`${prefix}_${name}`] : process.env[name];

    if (required && (!value || value.trim() === "")) {
      missing.push(name);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

export function getRequiredEnvVars() {
  return [
    {
      name: "DATABASE_URL",
      required: true,
      description: "Supabase PostgreSQL connection string",
    },
    {
      name: "DIRECT_URL",
      required: true,
      description: "Direct connection to PostgreSQL",
    },
    {
      name: "NEXT_PUBLIC_SUPABASE_URL",
      required: true,
      description: "Supabase project URL",
    },
    {
      name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      required: true,
      description: "Supabase anonymous key",
    },
    {
      name: "NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET",
      required: true,
      description: "Storage bucket name",
    },
  ];
}

export function checkEnvVars() {
  const requiredVars = getRequiredEnvVars();
  return validateEnv(requiredVars);
}
