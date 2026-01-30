import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import "../styles/legal.css";

export default function Legal() {
  const { t } = useLanguage();

  const termsHTML = `
    <h2>1. Giới thiệu</h2>
    <p>Chào mừng bạn đến với nền tảng của chúng tôi (sau đây gọi là "Nền tảng"). Bằng việc truy cập, đăng ký tài khoản, đăng bài hoặc sử dụng bất kỳ dịch vụ nào trên Nền tảng, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều khoản & Điều kiện này.</p>
    <p>Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng Nền tảng.</p>

    <h2>2. Đối tượng áp dụng</h2>
    <p>Điều khoản này áp dụng cho tất cả người dùng, bao gồm nhưng không giới hạn:</p>
    <ul>
      <li>Người dùng đăng ký tài khoản</li>
      <li>Người đăng bài, đăng tuyển, đăng quảng cáo</li>
      <li>Người xem, tìm kiếm và tương tác với các bài đăng</li>
    </ul>

    <h2>3. Tài khoản người dùng</h2>
    <h3>3.1. Đăng ký tài khoản</h3>
    <ul>
      <li>Người dùng phải cung cấp thông tin chính xác, đầy đủ và hợp pháp khi đăng ký.</li>
      <li>Mỗi cá nhân/tổ chức chỉ được tạo một tài khoản, trừ khi được Nền tảng cho phép bằng văn bản.</li>
    </ul>
    <h3>3.2. Bảo mật tài khoản</h3>
    <ul>
      <li>Người dùng có trách nhiệm bảo mật thông tin đăng nhập.</li>
      <li>Mọi hoạt động phát sinh từ tài khoản được xem là do chính người dùng thực hiện.</li>
    </ul>
    <h3>3.3. Đình chỉ hoặc chấm dứt tài khoản</h3>
    <p>Nền tảng có quyền tạm khóa hoặc xóa tài khoản nếu phát hiện vi phạm điều khoản, pháp luật hoặc có dấu hiệu gian lận.</p>

    <h2>4. Nội dung đăng tải</h2>
    <h3>4.1. Quyền đăng bài</h3>
    <p>Người dùng được phép đăng các nội dung như:</p>
    <ul>
      <li>Bài viết chia sẻ thông tin</li>
      <li>Tin tuyển dụng, tìm việc</li>
      <li>Bài quảng bá dịch vụ, sản phẩm (nếu được cho phép)</li>
    </ul>
    <h3>4.2. Trách nhiệm về nội dung</h3>
    <p>Người dùng chịu hoàn toàn trách nhiệm đối với nội dung do mình đăng tải, bao gồm nhưng không giới hạn:</p>
    <ul>
      <li>Tính chính xác, trung thực của thông tin</li>
      <li>Quyền sở hữu trí tuệ đối với hình ảnh, video, văn bản</li>
    </ul>
    <h3>4.3. Nội dung bị cấm</h3>
    <p>Người dùng không được phép đăng tải các nội dung sau:</p>
    <ul>
      <li>Nội dung vi phạm pháp luật Việt Nam</li>
      <li>Thông tin giả mạo, lừa đảo, gây nhầm lẫn</li>
      <li>Nội dung xúc phạm, bôi nhọ, phân biệt đối xử</li>
      <li>Nội dung khiêu dâm, bạo lực, phản cảm</li>
      <li>Spam, quảng cáo trái phép hoặc đa cấp</li>
      <li>Nội dung xâm phạm quyền riêng tư hoặc bản quyền của bên thứ ba</li>
    </ul>

    <h2>5. Kiểm duyệt và xử lý nội dung</h2>
    <p>Nền tảng có quyền kiểm duyệt, chỉnh sửa, ẩn hoặc xóa nội dung mà không cần báo trước nếu phát hiện vi phạm. Nền tảng không có nghĩa vụ kiểm duyệt trước tất cả nội dung do người dùng đăng tải.</p>

    <h2>6. Quyền sở hữu trí tuệ</h2>
    <p>Người dùng vẫn giữ quyền sở hữu đối với nội dung do mình đăng tải. Tuy nhiên, người dùng cấp cho Nền tảng quyền sử dụng, hiển thị, sao chép và phân phối nội dung đó nhằm mục đích vận hành và quảng bá dịch vụ.</p>

    <h2>7. Giao dịch và liên hệ giữa người dùng</h2>
    <p>Nền tảng chỉ đóng vai trò trung gian cung cấp thông tin. Mọi giao dịch, thỏa thuận, tuyển dụng hoặc tranh chấp phát sinh giữa các người dùng là trách nhiệm của các bên liên quan. Nền tảng không chịu trách nhiệm đối với thiệt hại phát sinh từ các giao dịch này.</p>

    <h2>8. Báo cáo vi phạm</h2>
    <p>Người dùng có thể báo cáo nội dung hoặc tài khoản vi phạm thông qua các công cụ trên Nền tảng. Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất có thể.</p>

    <h2>9. Giới hạn trách nhiệm</h2>
    <p>Nền tảng không đảm bảo mọi thông tin đăng tải đều chính xác hoặc phù hợp với nhu cầu của người dùng. Chúng tôi không chịu trách nhiệm đối với mất mát dữ liệu, gián đoạn dịch vụ hoặc thiệt hại gián tiếp phát sinh trong quá trình sử dụng.</p>

    <h2>10. Thay đổi điều khoản</h2>
    <p>Nền tảng có quyền cập nhật hoặc thay đổi Điều khoản & Điều kiện bất kỳ lúc nào. Phiên bản cập nhật sẽ được công bố trên Nền tảng và có hiệu lực kể từ thời điểm đăng tải.</p>

    <h2>11. Chấm dứt sử dụng</h2>
    <p>Người dùng có thể ngừng sử dụng Nền tảng bất kỳ lúc nào. Các nghĩa vụ và trách nhiệm phát sinh trước thời điểm chấm dứt vẫn còn hiệu lực.</p>

    <h2>12. Luật áp dụng</h2>
    <p>Điều khoản này được điều chỉnh và giải thích theo pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.</p>

    <h2>13. Liên hệ</h2>
    <p>Nếu có bất kỳ câu hỏi hoặc khiếu nại nào liên quan đến Điều khoản & Điều kiện, vui lòng liên hệ với chúng tôi qua thông tin được cung cấp trên Nền tảng.</p>
  `;

  const privacyHTML = `
    <h2>1. Mục đích</h2>
    <p>Chính sách Bảo mật này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của người dùng khi bạn truy cập và sử dụng Nền tảng đăng bài / đăng tuyển của chúng tôi (sau đây gọi là "Nền tảng"). Việc bạn sử dụng Nền tảng đồng nghĩa với việc bạn đồng ý với các nội dung được nêu trong Chính sách này.</p>

    <h2>2. Phạm vi áp dụng</h2>
    <p>Chính sách này áp dụng cho tất cả người dùng của Nền tảng, bao gồm:</p>
    <ul>
      <li>Người dùng đăng ký tài khoản</li>
      <li>Người đăng bài, đăng tuyển</li>
      <li>Người tìm kiếm thông tin, tương tác với bài đăng</li>
    </ul>

    <h2>3. Thông tin chúng tôi thu thập</h2>
    <h3>3.1. Thông tin cá nhân</h3>
    <p>Chúng tôi có thể thu thập các thông tin sau:</p>
    <ul>
      <li>Họ và tên</li>
      <li>Email, số điện thoại</li>
      <li>Ảnh đại diện</li>
      <li>Thông tin hồ sơ cá nhân, CV (nếu có)</li>
      <li>Thông tin doanh nghiệp/tổ chức (đối với tài khoản tuyển dụng)</li>
    </ul>
    <h3>3.2. Thông tin kỹ thuật</h3>
    <ul>
      <li>Địa chỉ IP</li>
      <li>Thiết bị, trình duyệt, hệ điều hành</li>
      <li>Thời gian truy cập, hành vi sử dụng Nền tảng</li>
    </ul>
    <h3>3.3. Nội dung người dùng cung cấp</h3>
    <ul>
      <li>Bài viết, tin tuyển dụng</li>
      <li>Hình ảnh, video, tệp đính kèm</li>
      <li>Tin nhắn, phản hồi, đánh giá</li>
    </ul>

    <h2>4. Mục đích sử dụng thông tin</h2>
    <p>Chúng tôi sử dụng thông tin người dùng để:</p>
    <ul>
      <li>Cung cấp và vận hành Nền tảng</li>
      <li>Quản lý tài khoản người dùng</li>
      <li>Hiển thị nội dung đăng tải</li>
      <li>Hỗ trợ tuyển dụng, kết nối người dùng</li>
      <li>Gửi thông báo, email liên quan đến hoạt động của tài khoản</li>
      <li>Cải thiện chất lượng dịch vụ và trải nghiệm người dùng</li>
    </ul>

    <h2>5. Chia sẻ thông tin</h2>
    <p>Chúng tôi không bán, trao đổi hoặc cho thuê thông tin cá nhân của người dùng cho bên thứ ba, trừ các trường hợp sau:</p>
    <ul>
      <li>Có sự đồng ý của người dùng</li>
      <li>Theo yêu cầu của cơ quan nhà nước có thẩm quyền</li>
      <li>Phục vụ cho việc vận hành kỹ thuật (hosting, email, phân tích dữ liệu) với các đối tác đáng tin cậy</li>
    </ul>

    <h2>6. Lưu trữ và bảo mật thông tin</h2>
    <p>Thông tin cá nhân được lưu trữ trên hệ thống máy chủ an toàn. Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phù hợp để bảo vệ dữ liệu khỏi truy cập trái phép, mất mát hoặc rò lỉ. Tuy nhiên, không có hệ thống nào an toàn tuyệt đối, chúng tôi không thể đảm bảo an ninh 100%.</p>

    <h2>7. Quyền của người dùng</h2>
    <p>Người dùng có quyền:</p>
    <ul>
      <li>Truy cập, xem và chỉnh sửa thông tin cá nhân</li>
      <li>Yêu cầu xóa tài khoản hoặc dữ liệu cá nhân</li>
      <li>Từ chối nhận email quảng bá</li>
      <li>Khiếu nại về việc sử dụng thông tin cá nhân</li>
    </ul>

    <h2>8. Cookie và công nghệ theo dõi</h2>
    <p>Nền tảng có thể sử dụng cookie để ghi nhớ phiên đăng nhập và tùy chỉnh trải nghiệm người dùng. Người dùng có thể tắt cookie trong trình duyệt, tuy nhiên một số chức năng có thể không hoạt động đầy đủ.</p>

    <h2>9. Thời gian lưu trữ dữ liệu</h2>
    <p>Thông tin cá nhân được lưu trữ trong suốt thời gian tài khoản còn hoạt động. Sau khi người dùng xóa tài khoản, dữ liệu sẽ được xóa hoặc ẩn theo quy định pháp luật hiện hành.</p>

    <h2>10. Liên kết bên thứ ba</h2>
    <p>Nền tảng có thể chứa liên kết đến website hoặc dịch vụ của bên thứ ba. Chúng tôi không chịu trách nhiệm đối với nội dung hoặc chính sách bảo mật của các bên này.</p>

    <h2>11. Thay đổi chính sách</h2>
    <p>Chúng tôi có quyền cập nhật hoặc thay đổi Chính sách Bảo mật này bất kỳ lúc nào. Phiên bản mới sẽ được công bố trên Nền tảng và có hiệu lực kể từ thời điểm đăng tải.</p>

  `;

  return (
    <>
      <Header />
      <main style={{ marginTop: "80px" }}  className="legal-page">
        <section className="legal-hero">
          <div className="legal-hero__container">
            <h1 className="legal-hero__title">{t("legal.title")}</h1>
            <p className="legal-hero__subtitle">
              {t("legal.subtitle")}
            </p>
          </div>
        </section>

        <section className="legal-content">
          <div className="legal-text-wrapper">
            <div className="legal-section">
              <h2 className="legal-section__title">{t("legal.terms")}</h2>
              <div
                className="legal-body"
                dangerouslySetInnerHTML={{ __html: termsHTML }}
              />
            </div>

            <div className="legal-divider-line" />

            <div className="legal-section">
              <h2 className="legal-section__title">{t("legal.privacy")}</h2>
              <div
                className="legal-body"
                dangerouslySetInnerHTML={{ __html: privacyHTML }}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


