<template>
  <div class="uc-container">
    <div class="brand-bar">
      <div class="brand-info">
        <div class="img">
          <img :src="brand.brand_logo">
        </div>
        <span>{{brand.brand_name}}</span>
      </div>
      <p class="coupon-count">{{brand.money_rolls_count}} 张现金券</p>
    </div>
    <ul class="coupon-list">
      <li v-for="item in brand.money_rolls_list" :key="item.id">
        <div class="coupon-rmb">￥{{item.price | cutDecimal}}</div>
        <div class="coupon-desc">
          <p>满{{item.condition | cutDecimal}}可用</p>
          <p>{{item.start_time | dateFormat}}~{{item.end_time | dateFormat}}</p>
        </div>
        <div class="coupon-btn-wrap">
          <button class="coupon-btn" @click="getBrandCoupon(item.id)" :disabled.prop="item.is_get">{{item.is_get ? '已领取' : '领取'}}</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/variables";

  .uc-container {
    background-color: $c_bg_commom;
  }

  .brand-bar {
    display: flex;
    align-items: center;
    height: 100px;
    background-color: #fff;
    border-bottom: 2px solid $c_border_common;

    .brand-info {
      flex: 1;
      padding-left: 30px;
      line-height: 80px;

      .img {
        float: left;
        width: 76px;
        height: 76px;
        margin-right: 20px;
        border-radius: 50%;
        overflow: hidden;
      }
    }

    .coupon-count {
      flex: 1;
      padding-right: 30px;
      text-align: right;
    }
  }

  .coupon-list {
    > li {
      display: flex;
      align-items: center;
      background-color: #fff;
      height: 180px;
      margin-top: 20px;
      padding: 0 20px;
      border-top: 2px dashed $c_border_common;
      border-bottom: 2px dashed $c_border_common;
      overflow: hidden;
    }

    .coupon-rmb {
      // float: left;
      width: 30%;
      line-height: 160px;
      text-align: center;
      border-right: 2px dashed $c_border_common;
      color: $c_text_highlight;
      font-size: 40px;
      font-weight: 500;
    }

    .coupon-desc {
      flex: 1;
      padding-left: 20px;
    }

    .coupon-btn-wrap {
      width: 20%;
      text-align: center;
    }

    .coupon-btn {
      display: inline-block;
      color: $c_text_highlight;
      line-height: 46px;
      padding: 0 20px;
      border: 2px solid $c_text_highlight;
      background-color: #fff;
      outline: none;

      &:active {
        opacity: .6;
      }

      &:disabled {
        color: $c_text_lighter;
        border-color: $c_text_lighter;
      }
    }
  }
</style>

<script>
  /* eslint new-cap: 0 */
  import { Toast } from 'mint-ui';

  export default {
    components: {
      Toast,
    },
    data() {
      return {
        brand: {},
      };
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        const brandId = this.$route.params.brandId;
        this.$http.get(`/proxy/money-rolls/brands/${brandId}`)
          .then((resp) => {
            const respData = resp.body;
            if (respData.status !== 'SUCCESS') {
              Toast(respData.error_message);
              return;
            }

            this.brand = respData.results[0];
          });
      },
      getBrandCoupon(couponId) {
        this.$http.post(`/proxy/money-rolls/${couponId}`)
          .then((resp) => {
            const respData = resp.body;
            const couponList = this.brand.money_rolls_list;

            if (respData.status !== 'SUCCESS') {
              Toast(respData.error_message);
              return;
            }

            couponList[couponList.findIndex(item => item.id === couponId)].is_get = 1;
            Toast('领取成功');
          });
      },
    },
    filters: {
      cutDecimal(val) {
        return parseInt(val, 10);
      },
    },
  };
</script>
