var HEAD_GENERATOR = {
  load : function(){
    $.ajax({
        url : "./assets/json/meta.json",
        type : 'GET',
        dataType : 'json',
        cache : false,
    }).then(
      $.proxy(function(data) { this.init(data); },this),
      function(data) { console.log('error'); }
    )
  },
  init : function(data){
    this.jsonData = data[0];
    this.setParameters();
    this.bindEvent();
  },
  setParameters: function() {
    this.$preview = $('.jsc-preview');
    this.$toggle = $('.jsc-toggle_switch');
    this.$metaEditField = $('.jsc-edit_meta_field');
    this.$generateBtn = $('.jsc-generate-btn');
  },
  bindEvent: function() {
    // set meta data
    this.$toggle.each($.proxy(function(index,target){
      this.firstTimeFlag = true;
      this.applyEditField($(target));
      this.firstTimeFlag = false;
    },this));

    // toggle時の処理
    this.$toggle.on('change', $.proxy(function(e) {
      var $target = $(e.target);
      this.applyEditField($target);
    },this));

    // previewへの反映処理
    this.$generateBtn.on('click', $.proxy(function() {
      this.applyPreview();
    },this));
  },
  applyEditField: function($target) {
    // 初期読み込みとtoggleの切り替えの際に発火するメソッド
    var $metaList = $target.closest('li'),
        $metaEditField = $metaList.find('.jsc-edit_meta_field'),
        $metaDescription = $metaList.find('.jsc-meta-description'),
        metaID = $target.attr('id'),
        meta = this.jsonData[metaID].meta.replace(/'/g, '"'); // ' -> " 変換

    if(this.firstTimeFlag) {
      $metaDescription.text(this.jsonData[metaID].description);
    }

    if($target.is(":checked")) {
      $metaEditField.val(meta);
    } else {
      $metaEditField.val('');
    }
  },
  applyPreview: function() {
    // generateBtn押下時に発火するメソッド
    var metaInfo = [];
    this.$metaEditField.each(function() {
      // 空文字の場合は配列に入れない
      if($(this).val().length==0) {
        return;
      } else {
        metaInfo.push($(this).val());
      }
    });
    this.$preview.val(metaInfo.join('\n'));
  }
};

$(function() {
  HEAD_GENERATOR.load();
});
