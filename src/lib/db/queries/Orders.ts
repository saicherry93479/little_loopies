import { sql, eq } from 'drizzle-orm';
import { db } from '../index';

export async function getEligibleStoresForOrder(orderId: string) {
  try {
    // Using db.run() instead of execute for raw SQL
    const eligibleStores = await db.run(sql`
      WITH OrderProducts AS (
        SELECT 
          product_id,
          quantity as required_quantity
        FROM order_items
        WHERE order_id = ${orderId}
      ),
      StoreInventoryCheck AS (
        SELECT 
          s.id as store_id,
          s.name,
          s.email,
          s.mobile,
          s.business_name,
          s.store_address,
          s.store_timings,
          s.status,
          COUNT(DISTINCT op.product_id) as products_available,
          (SELECT COUNT(*) FROM OrderProducts) as total_products_needed
        FROM store s
        JOIN store_products sp ON s.id = sp.store_id
        JOIN OrderProducts op ON sp.product_id = op.product_id
        WHERE 
          s.status = 'active'
          AND sp.is_active = 1
          AND sp.stock >= op.required_quantity
        GROUP BY s.id
      )
      SELECT 
        store_id as id,
        name,
        email,
        mobile,
        business_name as businessName,
        store_address as storeAddress,
        store_timings as storeTiming,
        status
      FROM StoreInventoryCheck
      WHERE products_available = total_products_needed
    `);

    console.log('eligibleStores ',eligibleStores.rows)
    // Format the results
    return eligibleStores.rows.map(store => ({
      ...store,
      storeAddress: store.storeAddress ? JSON.parse(store.storeAddress) : null,
      storeTiming: store.storeTiming ? JSON.parse(store.storeTiming) : null
    }));

  } catch (error) {
    console.error('Error finding eligible stores:', error);
    throw error;
  }
}
