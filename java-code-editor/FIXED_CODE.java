package com.example;


import junit.framework.Assert;

import java.util.ArrayList;
import java.util.OptionalInt;

class Stock {
    String symbol;
    String name;

    Stock(String symbol, String name) {
        this.symbol = symbol;
        this.name = name;
    }

    // @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (other == null || getClass() != other.getClass()) return false;
        Stock stock = (Stock) other;
        return symbol.equals(stock.symbol) && name.equals((stock.name));
    }

    // @Override
    public int hashCode() {
        return java.util.Objects.hash(symbol, name);
    }
}

class PriceRecord{
        Stock stock;
        int price;
        String date;

        PriceRecord(Stock stock, int price, String date){
            this.date=date;
            this.price= price;
            this.stock = stock;
        }
        
 }

 class StockCollection{
    ArrayList<PriceRecord> priceRecords = new ArrayList<>();
    Stock stock;

    StockCollection(Stock stock){
        this.stock= stock;
    }
    int getNumPriceRecords(){
        return  priceRecords.size();
    }

    void addPriceRecord(PriceRecord priceRecord){
        if(!priceRecord.stock.equals(this.stock)){
            throw new IllegalArgumentException("PriceRecord's Stock is not the same as the StockCollection's");
        }
        priceRecords.add(priceRecord);
    }

    int getMaxPrice(){
        OptionalInt maxprice = priceRecords.stream().mapToInt(record -> record.price ).max();
        if (maxprice.isPresent())
            return  maxprice.getAsInt();
        return -1;
    }

    int getMinPrice(){
        OptionalInt minprice = priceRecords.stream().mapToInt(record -> record.price ).min();
        if(minprice.isPresent())
            return minprice.getAsInt();
        return -1;
    }

    double getAvgPrice() {
        if (priceRecords.isEmpty()) {
            return -1;
        }
        double total = priceRecords.stream().mapToInt(r -> r.price).sum();
        return total / priceRecords.size();
    }

    public Object getBiggestChange() {
        if (priceRecords.size() < 2) {
            return null;
        }

        // Sort by date
        ArrayList<PriceRecord> sorted = new ArrayList<>(priceRecords);
        sorted.sort((a, b) -> a.date.compareTo(b.date));

        int maxChange = Integer.MIN_VALUE;
        String startDate = null;
        String endDate = null;

        for (int i = 1; i < sorted.size(); i++) {
            PriceRecord prev = sorted.get(i - 1);
            PriceRecord curr = sorted.get(i);

            int change = curr.price - prev.price;
            int absChange = Math.abs(change);

            if (absChange > maxChange) {
                maxChange = absChange;
                startDate = prev.date;
                endDate = curr.date;
            }
        }

        ArrayList<Object> result = new ArrayList<>();
        result.add(maxChange);
        result.add(startDate);
        result.add(endDate);

        return result;
    }

} // <-- THIS WAS MISSING!

public class Main {

    public static void main(String[] args){
       testPriceRecord();
//        testStockCollection();
//        testGetBiggestChange();
    }

    public static void testPriceRecord(){
        System.out.println("Returning testPriceRecord");
        Stock testStock = new Stock("AAPL", "Apple Inc.");
        PriceRecord testPriceRecord = new PriceRecord(testStock, 100, "2023-07-01");

        Assert.assertEquals(testPriceRecord.stock,testStock);
        Assert.assertEquals(testPriceRecord.price,100);
        Assert.assertEquals(testPriceRecord.date,"2023-07-01");
    }

    private static StockCollection makeStockCollection(Stock stock, Object[][] priceData){
        StockCollection stockCollection = new StockCollection(stock);
        for (Object[] priceRecordData: priceData){
            PriceRecord priceRecord = new PriceRecord(stock,(int)priceRecordData[0],(String) priceRecordData[1]);
            stockCollection.addPriceRecord(priceRecord);
        }
        return stockCollection;
    }

    public static void testStockCollection(){
        System.out.println("Running testStockCollection");
        Stock testStock = new Stock("AAPL","Apple Inc.");
        StockCollection stockCollection = new StockCollection(testStock);

        Assert.assertEquals(0, stockCollection.getNumPriceRecords());
        Assert.assertEquals(-1, stockCollection.getMaxPrice());
        Assert.assertEquals(-1, stockCollection.getMinPrice());
        Assert.assertEquals(-1.0, stockCollection.getAvgPrice(),0.001);

        /*
            price records:
            Price:  110          112         90      105
            date:  2023-06-29 2023-07-01 2023-06-28 2023-07-06
         */
        Object[][] priceData = {{110, "2023-06-29"},{112,"2023-07-01"},{90,"2023-06-28"},{105,"2023-07-06"}};
        testStock = new Stock("AAPL","Apple Inc.");
        stockCollection = makeStockCollection(testStock,priceData);

        Assert.assertEquals(priceData.length,stockCollection.getNumPriceRecords());
        Assert.assertEquals(112, stockCollection.getMaxPrice());
        Assert.assertEquals(90, stockCollection.getMinPrice());
        Assert.assertEquals(104.25, stockCollection.getAvgPrice(),0.1);
    }

    public static void testGetBiggestChange() {
        System.out.println("Running testGetBiggestChange");

        Stock stock = new Stock("AAPL", "Apple Inc.");

    /*
        Input (unordered by date):
        Price: 110        112        90         105
        Date:  2023-06-29 2023-07-01 2023-06-25 2023-07-06

        Sorted by date:
        2023-06-25 -> 90
        2023-06-29 -> 110  (change +20)  <-- biggest
        2023-07-01 -> 112  (change +2)
        2023-07-06 -> 105  (change -7)
     */

//        Object[][] priceData = {
//                {110, "2023-06-29"},
//                {112, "2023-07-01"},
//                {90,  "2023-06-25"},
//                {105, "2023-07-06"}
//        };
        Object[][] priceData = {
                {110, "29-06-2023"},
                {112, "01-07-2023"},
                {90,  "28-06-2023"},
                {105, "06-07-2023"}
        };

        StockCollection collection = makeStockCollection(stock, priceData);

        Object result = collection.getBiggestChange();
        Assert.assertNotNull(result);

        // @SuppressWarnings("unchecked")
        ArrayList<Object> output = (ArrayList<Object>) result;

        Assert.assertEquals(3, output.size());
        Assert.assertEquals(20, output.get(0));                 // biggest change
        Assert.assertEquals("2023-06-25", output.get(1));       // start date
        Assert.assertEquals("2023-06-29", output.get(2));       // end date
    }

}
