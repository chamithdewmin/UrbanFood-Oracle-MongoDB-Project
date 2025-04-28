-- Customers Table
CREATE TABLE customers (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(100 CHAR) NOT NULL,
    email VARCHAR2(150 CHAR) UNIQUE NOT NULL,
    phone VARCHAR2(15 CHAR),
    address VARCHAR2(255 CHAR)
);

-- Suppliers Table
CREATE TABLE suppliers (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(100 CHAR) NOT NULL,
    location VARCHAR2(255 CHAR) NOT NULL
);

-- Products Table
CREATE TABLE products (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(255 CHAR) NOT NULL,
    category VARCHAR2(100 CHAR),
    price NUMBER(10,2) NOT NULL,
    supplier_id NUMBER,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE orders (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id NUMBER,
    order_date DATE DEFAULT SYSDATE,
    total_amount NUMBER(10,2) NOT NULL,
    status VARCHAR2(50 CHAR) DEFAULT 'Pending',
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE order_items (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id NUMBER,
    product_id NUMBER,
    quantity NUMBER NOT NULL,
    price NUMBER(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Payments Table
CREATE TABLE payments (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id NUMBER,
    amount NUMBER(10,2) NOT NULL,
    payment_date DATE DEFAULT SYSDATE,
    status VARCHAR2(50 CHAR) DEFAULT 'Pending',
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);




-- Insert into Suppliers
INSERT INTO suppliers (name, location) 
VALUES ('Fresh Farm', 'California');

-- Insert into Customers
INSERT INTO customers (name, email, phone, address) 
VALUES ('Bob Marley', 'bob@example.com', '9876543210', 'Kingston, Jamaica');

-- Insert into Products
-- supplier_id = 1 (Fresh Farm)
INSERT INTO products (name, category, price, supplier_id) 
VALUES ('Avocado', 'Fruits', 3.00, 1);

-- Insert into Orders
-- customer_id = 1 (Bob Marley)
INSERT INTO orders (customer_id, total_amount, status) 
VALUES (1, 6.00, 'Pending');

-- Insert into Order Items
-- order_id = 1 (First Order), product_id = 1 (Avocado)
INSERT INTO order_items (order_id, product_id, quantity, price) 
VALUES (1, 1, 2, 6.00);

-- Insert into Payments
-- order_id = 1 (First Order)
INSERT INTO payments (order_id, amount, status) 
VALUES (1, 6.00, 'Completed');

-- Commit all changes
COMMIT;


SELECT * FROM suppliers;


//Procedure


-- Insert into Suppliers Procedure
CREATE OR REPLACE PROCEDURE insert_supplier(
    p_name IN suppliers.name%TYPE,
    p_location IN suppliers.location%TYPE
) IS
BEGIN
    INSERT INTO suppliers(name, location)
    VALUES (p_name, p_location);
END;
/

-- Insert into Customers Procedure
CREATE OR REPLACE PROCEDURE insert_customer(
    p_name IN customers.name%TYPE,
    p_email IN customers.email%TYPE,
    p_phone IN customers.phone%TYPE,
    p_address IN customers.address%TYPE
) IS
BEGIN
    INSERT INTO customers(name, email, phone, address)
    VALUES (p_name, p_email, p_phone, p_address);
END;
/

-- Insert into Products Procedure
CREATE OR REPLACE PROCEDURE insert_product(
    p_name IN products.name%TYPE,
    p_category IN products.category%TYPE,
    p_price IN products.price%TYPE,
    p_supplier_id IN products.supplier_id%TYPE
) IS
BEGIN
    INSERT INTO products(name, category, price, supplier_id)
    VALUES (p_name, p_category, p_price, p_supplier_id);
END;
/

-- Insert into Orders Procedure
CREATE OR REPLACE PROCEDURE insert_order(
    p_customer_id IN orders.customer_id%TYPE,
    p_total_amount IN orders.total_amount%TYPE,
    p_status IN orders.status%TYPE DEFAULT 'Pending'
) IS
BEGIN
    INSERT INTO orders(customer_id, total_amount, status)
    VALUES (p_customer_id, p_total_amount, NVL(p_status, 'Pending'));
END;
/

-- Insert into Order Items Procedure
CREATE OR REPLACE PROCEDURE insert_order_item(
    p_order_id IN order_items.order_id%TYPE,
    p_product_id IN order_items.product_id%TYPE,
    p_quantity IN order_items.quantity%TYPE,
    p_price IN order_items.price%TYPE
) IS
BEGIN
    INSERT INTO order_items(order_id, product_id, quantity, price)
    VALUES (p_order_id, p_product_id, p_quantity, p_price);
END;
/

-- Insert into Payments Procedure
CREATE OR REPLACE PROCEDURE insert_payment(
    p_order_id IN payments.order_id%TYPE,
    p_amount IN payments.amount%TYPE,
    p_status IN payments.status%TYPE DEFAULT 'Pending'
) IS
BEGIN
    INSERT INTO payments(order_id, amount, status)
    VALUES (p_order_id, p_amount, NVL(p_status, 'Pending'));
END;
/










//Tiggers



-- Trigger to set default 'Pending' if order status is NULL
CREATE OR REPLACE TRIGGER trg_before_order_insert
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    IF :NEW.status IS NULL THEN
        :NEW.status := 'Pending';
    END IF;
END;
/

-- Trigger to set default 'Pending' if payment status is NULL
CREATE OR REPLACE TRIGGER trg_before_payment_insert
BEFORE INSERT ON payments
FOR EACH ROW
BEGIN
    IF :NEW.status IS NULL THEN
        :NEW.status := 'Pending';
    END IF;
END;
/











-- Update Customer Procedure
CREATE OR REPLACE PROCEDURE update_customer(
    p_id IN customers.id%TYPE,
    p_name IN customers.name%TYPE,
    p_email IN customers.email%TYPE,
    p_phone IN customers.phone%TYPE,
    p_address IN customers.address%TYPE
) IS
BEGIN
    UPDATE customers
    SET name = p_name,
        email = p_email,
        phone = p_phone,
        address = p_address
    WHERE id = p_id;
END;
/

-- Delete Customer Procedure
CREATE OR REPLACE PROCEDURE delete_customer(
    p_id IN customers.id%TYPE
) IS
BEGIN
    DELETE FROM customers
    WHERE id = p_id;
END;
/







-- Update Supplier Procedure
CREATE OR REPLACE PROCEDURE update_supplier(
    p_id IN suppliers.id%TYPE,
    p_name IN suppliers.name%TYPE,
    p_location IN suppliers.location%TYPE
) IS
BEGIN
    UPDATE suppliers
    SET name = p_name,
        location = p_location
    WHERE id = p_id;
END;
/

-- Delete Supplier Procedure
CREATE OR REPLACE PROCEDURE delete_supplier(
    p_id IN suppliers.id%TYPE
) IS
BEGIN
    DELETE FROM suppliers
    WHERE id = p_id;
END;
/





-- Update Product Procedure
CREATE OR REPLACE PROCEDURE update_product(
    p_id IN products.id%TYPE,
    p_name IN products.name%TYPE,
    p_category IN products.category%TYPE,
    p_price IN products.price%TYPE,
    p_supplier_id IN products.supplier_id%TYPE
) IS
BEGIN
    UPDATE products
    SET name = p_name,
        category = p_category,
        price = p_price,
        supplier_id = p_supplier_id
    WHERE id = p_id;
END;
/

-- Delete Product Procedure
CREATE OR REPLACE PROCEDURE delete_product(
    p_id IN products.id%TYPE
) IS
BEGIN
    DELETE FROM products
    WHERE id = p_id;
END;
/






-- Update Order Procedure
CREATE OR REPLACE PROCEDURE update_order(
    p_id IN orders.id%TYPE,
    p_customer_id IN orders.customer_id%TYPE,
    p_total_amount IN orders.total_amount%TYPE,
    p_status IN orders.status%TYPE
) IS
BEGIN
    UPDATE orders
    SET customer_id = p_customer_id,
        total_amount = p_total_amount,
        status = NVL(p_status, 'Pending')
    WHERE id = p_id;
END;
/

-- Delete Order Procedure
CREATE OR REPLACE PROCEDURE delete_order(
    p_id IN orders.id%TYPE
) IS
BEGIN
    -- First delete order_items and payments (because of foreign key constraints)
    DELETE FROM order_items WHERE order_id = p_id;
    DELETE FROM payments WHERE order_id = p_id;
    
    -- Then delete the order
    DELETE FROM orders WHERE id = p_id;
END;
/




-- Update Order Item Procedure
CREATE OR REPLACE PROCEDURE update_order_item(
    p_id IN order_items.id%TYPE,
    p_order_id IN order_items.order_id%TYPE,
    p_product_id IN order_items.product_id%TYPE,
    p_quantity IN order_items.quantity%TYPE,
    p_price IN order_items.price%TYPE
) IS
BEGIN
    UPDATE order_items
    SET order_id = p_order_id,
        product_id = p_product_id,
        quantity = p_quantity,
        price = p_price
    WHERE id = p_id;
END;
/

-- Delete Order Item Procedure
CREATE OR REPLACE PROCEDURE delete_order_item(
    p_id IN order_items.id%TYPE
) IS
BEGIN
    DELETE FROM order_items
    WHERE id = p_id;
END;
/




-- Update Payment Procedure
CREATE OR REPLACE PROCEDURE update_payment(
    p_id IN payments.id%TYPE,
    p_order_id IN payments.order_id%TYPE,
    p_amount IN payments.amount%TYPE,
    p_status IN payments.status%TYPE
) IS
BEGIN
    UPDATE payments
    SET order_id = p_order_id,
        amount = p_amount,
        status = NVL(p_status, 'Pending')
    WHERE id = p_id;
END;
/

-- Delete Payment Procedure
CREATE OR REPLACE PROCEDURE delete_payment(
    p_id IN payments.id%TYPE
) IS
BEGIN
    DELETE FROM payments
    WHERE id = p_id;
END;
/

