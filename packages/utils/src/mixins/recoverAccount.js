export default {
  methods: {
    openDialog() {
      this.$Lconfirm({
        showCancelBtn: false,
        confirmBtnText: '知道了',
        render: () => (
          <span>
            已实名账号,
            请使用北象App自助找回账号。如未实名或无法使用移动端,&nbsp;
            您也可以通过
            <span class="link" onClick={() => this.accountAppeal()}>
              账号申诉
            </span>
            找回账号。
          </span>
        ),
      });
    },
    accountAppeal() {
      console.log(123);
    },
  },
};
