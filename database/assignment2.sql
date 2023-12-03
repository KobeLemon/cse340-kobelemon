------------------ WEEK 02 ASSIGNMENT 2 TASK 1 SQL STATEMENTS ------------------

-- ALWAYS RUN ALL OF THESE STATEMENTS AFTER YOU RUN THE "db-sql-code.sql" STATEMENTS
----------------------------------------------------------------

-- Insert a user with the specified info into the account table
INSERT INTO public.account (
  account_firstname,
  account_lastname,
  account_email,
  account_password
) VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  );
SELECT * FROM public.account;

-- Set Tony Stark's account_type to 'Admin'
UPDATE public.account
  SET account_type = 'Admin'
  WHERE account_id = 1;
SELECT * FROM public.account;

-- Delete the Tony Stark record from the account table
DELETE FROM account WHERE account_id = 1;
SELECT * FROM public.account;

-- Replace "the small interiors" with "a huge interior" for the Hummer
SELECT * FROM public.inventory WHERE inv_id = 10;
UPDATE public.inventory
  SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
  WHERE inv_id = 10;
SELECT * FROM public.inventory WHERE inv_id = 10;

-- Join inventory table & classification table with Sports cars
SELECT
  inventory.inv_make,
  inventory.inv_model,
  inventory.classification_id,
  classification.classification_name
  FROM public.inventory
INNER JOIN
  classification ON inventory.classification_id = classification.classification_id
  WHERE inventory.classification_id = 2;

-- Add "/vehicles" to all of the "inv_image" & "inv_thumbnail" columns in the inventory table
SELECT inv_image, inv_thumbnail FROM public.inventory;
UPDATE public.inventory
  SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
      inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');
SELECT inv_image, inv_thumbnail FROM public.inventory;
