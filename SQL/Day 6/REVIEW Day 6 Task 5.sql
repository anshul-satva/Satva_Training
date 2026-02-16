-- Top 5 best selling products
SELECT 
	TOP 5
	p.Product_id,
	p.Product_name,
	p.Category_name,
	COUNT(o.Quantity) AS TotalOrders
FROM Orders o
INNER JOIN Products p
ON o.Product_id = p.Product_id 
GROUP BY p.Product_id,p.Product_name, p.Category_name
ORDER BY TotalOrders DESC

SELECT * FROM Promotions
SELECT * FROM Orders


-------------
UPDATE Promotions
SET Active = 0
WHERE End_date < GETDATE();

INSERT INTO Promotions (Product_id, Promotion_name, Start_date, End_date, DiscountAmount, Active) VALUES
(1, 'Summer Sale', '2026-01-01', '2026-05-25', 5.00, 1)

INSERT INTO Orders 
(Promotion_id, Product_id, Quantity, Customer_id, Order_date, Price) 
VALUES (38, 11, 2, 12, '2026-03-5 10:00:00', 159.98)

INSERT INTO Orders 
(Promotion_id, Product_id, Quantity, Customer_id, Order_date, Price) 
VALUES (NULL, 11, 2, 12, '2025-03-5 10:00:00', 159.98)