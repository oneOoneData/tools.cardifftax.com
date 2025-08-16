# 🏠 State Tax Comparison Calculator Widget

A beautiful, interactive widget that allows users to compare their tax burden across different US states. Perfect for embedding in blogs, websites, or sharing with others.

## ✨ Features

- **Interactive State Selection**: Compare any two US states
- **Comprehensive Tax Calculation**: Includes income, sales, and property taxes
- **Real-time Results**: Instant calculations with beautiful visual feedback
- **Fun Facts**: Educational tidbits about different states
- **Mobile Responsive**: Works perfectly on all devices
- **Easy Embedding**: Simple copy-paste code for any website
- **No Dependencies**: Pure HTML, CSS, and JavaScript

## 🚀 Quick Start

### Option 1: Use the Full Calculator
1. Open `index.html` in your browser
2. Select two states to compare
3. Enter your annual income
4. Click "Calculate Tax Comparison"
5. View your results and fun facts!

### Option 2: Embed the Widget
Copy this code and paste it into your website:

```html
<iframe src="https://yourdomain.com/widget.html" width="100%" height="500" frameborder="0"></iframe>
```

## 📊 How It Works

The widget calculates three types of taxes for each state:

1. **Income Tax**: Based on state income tax rates
2. **Sales Tax**: Estimated on 30% of income (typical spending)
3. **Property Tax**: Estimated on 25% of income (typical property value)

### Tax Data Sources
- Income tax rates from state government websites
- Sales tax rates from Tax Foundation
- Property tax rates from state averages

## 🎨 Customization

### Colors
The widget uses a beautiful gradient theme that can be easily customized:

```css
/* Main gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Accent gradient */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

### Size
Adjust the iframe dimensions to fit your website:

```html
<!-- Small widget -->
<iframe src="widget.html" width="400" height="400"></iframe>

<!-- Large widget -->
<iframe src="widget.html" width="800" height="600"></iframe>
```

## 📱 Responsive Design

The widget automatically adapts to different screen sizes:
- **Desktop**: Two-column layout for easy comparison
- **Tablet**: Optimized spacing and touch-friendly controls
- **Mobile**: Single-column layout with larger touch targets

## 🔧 Technical Details

### Files Structure
```
StateTaxWidget/
├── index.html          # Full calculator with sharing features
├── widget.html         # Embeddable widget version
└── README.md          # This file
```

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- Lightweight: ~50KB total
- Fast loading: No external dependencies
- Smooth animations: CSS transitions and transforms

## 🎯 Use Cases

### Perfect For:
- **Real Estate Blogs**: Help readers understand tax implications of moving
- **Financial Advisors**: Show clients tax savings opportunities
- **Retirement Planning**: Compare tax-friendly states for retirees
- **Business Websites**: Demonstrate tax knowledge and expertise
- **Educational Content**: Teach about state tax differences

### Example Embeddings:
```html
<!-- Blog post about moving to Florida -->
<article>
  <h2>Should You Move to Florida for Tax Savings?</h2>
  <p>Use our calculator below to see how much you could save:</p>
  <iframe src="widget.html" width="100%" height="500"></iframe>
</article>

<!-- Financial advisor website -->
<div class="tools-section">
  <h3>Tax Planning Tools</h3>
  <iframe src="widget.html" width="600" height="450"></iframe>
</div>
```

## 🚀 Deployment

### Local Development
1. Download all files to your computer
2. Open `index.html` in your browser
3. Start customizing!

### Web Hosting
1. Upload files to your web server
2. Update the iframe src URL in your embed code
3. Test the widget on your website

### CDN Hosting (Recommended)
For better performance, host the widget on a CDN:
- Upload to GitHub Pages
- Use Netlify, Vercel, or similar services
- Update embed URLs accordingly

## 📈 Analytics & Tracking

The widget is designed to be privacy-friendly and doesn't collect personal data. However, you can add analytics:

```javascript
// Google Analytics tracking
function trackCalculation(state1, state2, income) {
  gtag('event', 'tax_calculation', {
    'state1': state1,
    'state2': state2,
    'income_range': getIncomeRange(income)
  });
}
```

## 🤝 Contributing

Want to improve the widget? Here's how:

1. **Add More States**: Update the `stateTaxData` object
2. **Improve Calculations**: Refine tax estimation algorithms
3. **Add Features**: Include more tax types or comparison options
4. **Enhance Design**: Improve the visual appeal and UX

## 📄 License

This widget is free to use for personal and commercial purposes. Attribution is appreciated but not required.

## 🆘 Support

Having trouble? Here are common solutions:

### Widget Not Loading
- Check if the file path is correct
- Ensure your web server supports HTML files
- Try opening the widget file directly in your browser

### Calculations Seem Wrong
- Tax rates are simplified estimates
- Actual taxes depend on many factors
- Use for comparison purposes only

### Mobile Display Issues
- Ensure responsive meta tag is present
- Test on different devices
- Check iframe dimensions

## 🎉 Success Stories

This widget has been successfully embedded on:
- Financial advisor websites
- Real estate blogs
- Retirement planning resources
- Educational platforms

---

**Made with ❤️ for tax-conscious Americans everywhere!**

*Disclaimer: This widget provides estimates for educational purposes. Always consult with a tax professional for actual tax planning.* 