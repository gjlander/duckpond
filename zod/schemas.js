import { z } from 'zod/v4';
const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  password: z.string().min(8)
});

const signInSchema = userSchema.omit({ firstName: true, lastName: true });

const duckSchema = z.object({
  name: z.string().min(1),
  imgUrl: z.url({
    protocol: /^https?$/,
    hostname: z.regexes.domain
  }),
  quote: z.string().min(1),
  owner: z.string().min(1)
});

const wildDuckSchema = duckSchema.omit({ owner: true });
export { userSchema, signInSchema, duckSchema, wildDuckSchema };
