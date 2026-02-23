package com.example;

import java.util.ArrayList;
import java.util.OptionalInt;

class Stock {
    String symbol;
    String name;

    Stock(String symbol, String name) {
        this.symbol = symbol;
        this.name = name;
    }

    public boolean equals(Object other) {
        if (this == other) return true;
        if (other == null || getClass() != other.getClass()) return false;
        Stock stock = (Stock) other;
        return symbol.equals(stock.symbol) && name.equals((stock.name));
    }

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
        OptionalInt maxprice = priceRecords.stream().mapToInt(record -> record.price).max();
        if (maxprice.isPresent())
            return  maxprice.getAsInt();
        return -1;
    }

    int getMinPrice(){
        OptionalInt minprice = priceRecords.stream().mapToInt(record -> record.price).min();
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
}

public class Main {

    public static void main(String[] args){
        System.out.println("=== Running Stock Tests ===\n");
        testPriceRecord();
        testStockCollection();
        testGetBiggestChange();
        System.out.println("\n=== All Tests Passed! ===");
    }

    public static void testPriceRecord(){
        System.out.println("Test 1: PriceRecord Creation");
        Stock testStock = new Stock("AAPL", "Apple Inc.");
        PriceRecord testPriceRecord = new PriceRecord(testStock, 100, "2023-07-01");

        assert testPriceRecord.stock.equals(testStock) : "Stock mismatch";
        assert testPriceRecord.price == 100 : "Price mismatch";
        assert testPriceRecord.date.equals("2023-07-01") : "Date mismatch";
        
        System.out.println("  ✓ Stock: " + testStock.symbol);
        System.out.println("  ✓ Price: " + testPriceRecord.price);
        System.out.println("  ✓ Date: " + testPriceRecord.date);
        System.out.println("  PASSED\n");
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
        System.out.println("Test 2: StockCollection Operations");
        Stock testStock = new Stock("AAPL","Apple Inc.");
        StockCollection stockCollection = new StockCollection(testStock);

        assert stockCollection.getNumPriceRecords() == 0 : "Initial count should be 0";
        assert stockCollection.getMaxPrice() == -1 : "Max price should be -1 when empty";
        assert stockCollection.getMinPrice() == -1 : "Min price should be -1 when empty";
        assert stockCollection.getAvgPrice() == -1.0 : "Avg price should be -1 when empty";

        Object[][] priceData = {{110, "2023-06-29"},{112,"2023-07-01"},{90,"2023-06-28"},{105,"2023-07-06"}};
        stockCollection = makeStockCollection(testStock, priceData);

        assert stockCollection.getNumPriceRecords() == priceData.length : "Record count mismatch";
        assert stockCollection.getMaxPrice() == 112 : "Max price should be 112";
        assert stockCollection.getMinPrice() == 90 : "Min price should be 90";
        assert Math.abs(stockCollection.getAvgPrice() - 104.25) < 0.1 : "Avg price should be 104.25";
        
        System.out.println("  ✓ Records: " + stockCollection.getNumPriceRecords());
        System.out.println("  ✓ Max Price: " + stockCollection.getMaxPrice());
        System.out.println("  ✓ Min Price: " + stockCollection.getMinPrice());
        System.out.println("  ✓ Avg Price: " + stockCollection.getAvgPrice());
        System.out.println("  PASSED\n");
    }

    public static void testGetBiggestChange() {
        System.out.println("Test 3: Biggest Price Change");

        Stock stock = new Stock("AAPL", "Apple Inc.");
        Object[][] priceData = {
                {110, "2023-06-29"},
                {112, "2023-07-01"},
                {90,  "2023-06-25"},
                {105, "2023-07-06"}
        };

        StockCollection collection = makeStockCollection(stock, priceData);
        Object result = collection.getBiggestChange();
        
        assert result != null : "Result should not be null";

        @SuppressWarnings("unchecked")
        ArrayList<Object> output = (ArrayList<Object>) result;

        assert output.size() == 3 : "Output should have 3 elements";
        assert (int)output.get(0) == 20 : "Biggest change should be 20";
        assert output.get(1).equals("2023-06-25") : "Start date should be 2023-06-25";
        assert output.get(2).equals("2023-06-29") : "End date should be 2023-06-29";
        
        System.out.println("  ✓ Biggest Change: " + output.get(0));
        System.out.println("  ✓ From: " + output.get(1) + " to " + output.get(2));
        System.out.println("  PASSED\n");
    }
}
