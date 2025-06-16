import { z } from "zod";

/**
 * Validator for category names.
 * Ensures the name is a non-empty string and contains only alphanumeric characters and hyphens.
 */
export const CATEGORY_NAME_VALIDATOR = z
  .string()
  .min(1, "Category name is required.")
  .regex(
        /^[a-zA-Z0-9-]+$/,
        "Category name can only contain letters, numbers or hypens."
    )
