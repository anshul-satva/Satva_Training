Use ECommerceDB

select * from Customers
where city IN('Ahmedabad','USA')

select * from Customers
where Email LIKE '%an%'

--Calculate Total Sales Revenue per Product
--Join the Orders, Payment, and Products tables to calculate the total sales revenue for each product.
--Display the product name along with the total revenue.




SELECT  
	p.ProductID,
	p.ProductName,
	p.Category,
	SUM(od.Subtotal) AS 'Total Revenue',
	COUNT(od.Quantity) AS 'Total Quantity Sold'
FROM Products p
INNER JOIN OrderDetails od on p.ProductID = od.ProductID
INNER JOIN Orders o on od.OrderID = o.OrderID
INNER JOIN Payment py on od.OrderID = py.OrderID
WHERE py.PaymentStatus IN ('Completed', 'Partial')
GROUP BY p.ProductID, p.ProductName, p.Category