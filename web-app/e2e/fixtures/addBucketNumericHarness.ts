import { configureStore } from "@reduxjs/toolkit";
import addBucketReducer, * as addBucketActions from "../../src/screens/Console/Buckets/ListBuckets/AddBucket/addBucketsSlice";
import { addBucketAsync } from "../../src/screens/Console/Buckets/ListBuckets/AddBucket/addBucketThunks";

const store = configureStore({
  reducer: {
    addBucket: addBucketReducer,
    console: () => ({
      session: {
        permissions: { "*": ["s3:CreateBucket"] },
      },
    }),
    system: () => ({
      distributedSetup: true,
      siteReplicationInfo: { enabled: false },
    }),
  },
});

(window as any).addBucketNumericHarness = {
  addBucketActions,
  addBucketAsync,
  store,
};
